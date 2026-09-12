package com.airline.reservation.service;

import com.airline.reservation.repository.*;
import com.airline.reservation.dto.ApiResponse;
import com.airline.reservation.entity.*;
import com.airline.reservation.exception.*;
import com.airline.reservation.dto.request.BookingRequestDto;
import com.airline.reservation.dto.request.PassengerRequestDto;
import com.airline.reservation.dto.response.BookingResponseDto;
import com.airline.reservation.dto.response.PassengerResponseDto;
import com.airline.reservation.dto.response.PaymentResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService{

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final FlightScheduleRepository scheduleRepository;
    private final PassengerRepository passengerRepository;
    private final PaymentRepository paymentRepository;
    private final EmailService emailService;
    private final SeatBroadcastService seatBroadcastService;
    private final BookingCancellationService cancellationService;
    private final com.airline.reservation.security.AccessGuard accessGuard;

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private KafkaProducerService kafkaProducerService;

    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto request) {

        User user = getLoggedInUser();

        FlightSchedule schedule = scheduleRepository.findByIdWithLock(request.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Flight schedule not found with id: " + request.getScheduleId()));

        if (schedule.getStatus() != ScheduleStatus.SCHEDULED) {
            throw new BadRequestException(
                    "This flight is " + schedule.getStatus().name().toLowerCase()
                            + " and cannot be booked");
        }

        if (schedule.getJourneyDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot book a past flight");
        }

        if (schedule.getAvailableSeats() < request.getNumberOfPassengers()) {
            throw new BadRequestException(
                    "Not enough seats available. Requested: " + request.getNumberOfPassengers()
                            + ", Available: " + schedule.getAvailableSeats());
        }

        if (bookingRepository.existsByUserIdAndFlightScheduleIdAndStatusNot(
                user.getId(), schedule.getId(), BookingStatus.CANCELLED)) {
            throw new DuplicateResourceException(
                    "You have already booked this flight");
        }

        BigDecimal totalAmount = schedule.getPrice()
                .multiply(BigDecimal.valueOf(request.getNumberOfPassengers()));

        String bookingRef = generateBookingReference();

        schedule.setAvailableSeats(schedule.getAvailableSeats() - request.getNumberOfPassengers());
        scheduleRepository.save(schedule);

        Booking booking = Booking.builder()
                .bookingReference(bookingRef)
                .user(user)
                .flightSchedule(schedule)
                .numberOfPassengers(request.getNumberOfPassengers())
                .totalAmount(totalAmount)
                .status(BookingStatus.PENDING)
                .build();

        Booking saved = bookingRepository.save(booking);
        log.info("Booking created: {} by user {}", bookingRef, user.getEmail());

        // Publish Kafka booking event
        com.airline.reservation.event.BookingEvent bookingEvent = com.airline.reservation.event.BookingEvent.builder()
                .bookingId(saved.getId())
                .bookingReference(bookingRef)
                .eventType("CREATED")
                .userId(user.getId())
                .userEmail(user.getEmail())
                .userName(user.getFirstName() + " " + user.getLastName())
                .flightNumber(schedule.getFlight().getFlightNumber())
                .airlineName(schedule.getFlight().getAirline().getName())
                .originCity(schedule.getFlight().getOriginAirport().getCity())
                .destinationCity(schedule.getFlight().getDestinationAirport().getCity())
                .journeyDate(schedule.getJourneyDate())
                .departureTime(schedule.getDepartureTime())
                .numberOfPassengers(request.getNumberOfPassengers())
                .totalAmount(totalAmount)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        if (kafkaProducerService != null) kafkaProducerService.publishBookingEvent(bookingEvent);

        return mapToResponse(saved);
    }

    @Transactional
    public BookingResponseDto addPassengers(Long bookingId, List<PassengerRequestDto> requests) {

        Booking booking = findBookingById(bookingId);

        // Strict: even an admin should not be silently rewriting a customer's passenger list
        // through the customer-facing endpoint.
        accessGuard.requireOwner(booking.getUser(), "booking");

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException(
                    "Cannot add passengers to a " + booking.getStatus().name().toLowerCase()
                            + " booking");
        }

        if (requests.size() != booking.getNumberOfPassengers()) {
            throw new BadRequestException(
                    "Passenger count mismatch. Expected: " + booking.getNumberOfPassengers()
                            + ", Provided: " + requests.size());
        }

        List<Passenger> existing = passengerRepository.findByBookingId(bookingId);
        if (!existing.isEmpty()) {
            passengerRepository.deleteAll(existing);
        }

        List<Passenger> passengers = requests.stream()
                .map(req -> {
                    Gender gender;
                    try {
                        gender = Gender.valueOf(req.getGender().toUpperCase());
                    } catch (IllegalArgumentException e) {
                        throw new BadRequestException(
                                "Invalid gender: " + req.getGender()
                                        + ". Allowed: MALE, FEMALE, OTHER");
                    }

                    return Passenger.builder()
                            .booking(booking)
                            .firstName(req.getFirstName().trim())
                            .lastName(req.getLastName().trim())
                            .gender(gender)
                            .dateOfBirth(req.getDateOfBirth())
                            .idType(req.getIdType().toUpperCase())
                            .idNumber(req.getIdNumber().trim())
                            .build();
                })
                .collect(Collectors.toList());

        passengerRepository.saveAll(passengers);
        log.info("Passengers added to booking {}", booking.getBookingReference());

        Booking refreshed = findBookingById(bookingId);
        return mapToResponse(refreshed);
    }

    @Transactional
    public ApiResponse<Void> cancelBooking(Long bookingId) {

        User user = getLoggedInUser();
        Booking booking = findBookingById(bookingId);

        accessGuard.requireOwnerOrAdmin(booking.getUser(), "booking");

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed booking");
        }

        FlightSchedule schedule = booking.getFlightSchedule();
        cancellationService.cancelAndReleaseSeats(booking);
        seatBroadcastService.broadcastSeatUpdate(schedule.getId());

        // Publish Kafka booking cancellation event
        com.airline.reservation.event.BookingEvent bookingEvent = com.airline.reservation.event.BookingEvent.builder()
                .bookingId(booking.getId())
                .bookingReference(booking.getBookingReference())
                .eventType("CANCELLED")
                .userId(user.getId())
                .userEmail(user.getEmail())
                .userName(user.getFirstName() + " " + user.getLastName())
                .flightNumber(booking.getFlightSchedule().getFlight().getFlightNumber())
                .airlineName(booking.getFlightSchedule().getFlight().getAirline().getName())
                .originCity(booking.getFlightSchedule().getFlight().getOriginAirport().getCity())
                .destinationCity(booking.getFlightSchedule().getFlight().getDestinationAirport().getCity())
                .journeyDate(booking.getFlightSchedule().getJourneyDate())
                .departureTime(booking.getFlightSchedule().getDepartureTime())
                .numberOfPassengers(booking.getNumberOfPassengers())
                .totalAmount(booking.getTotalAmount())
                .timestamp(java.time.LocalDateTime.now())
                .build();
        if (kafkaProducerService != null) kafkaProducerService.publishBookingEvent(bookingEvent);

        Payment payment = paymentRepository.findByBookingId(bookingId).orElse(null);
        emailService.sendBookingCancellationEmail(booking, payment);

        log.info("Booking {} cancelled by {}", booking.getBookingReference(), user.getEmail());
        return ApiResponse.success(
                "Booking " + booking.getBookingReference() + " cancelled successfully", null);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getMyBookings() {
        User user = getLoggedInUser();
        return bookingRepository.findByUserIdWithDetails(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponseDto getBookingById(Long id) {
        Booking booking = findBookingById(id);
        accessGuard.requireOwnerOrAdmin(booking.getUser(), "booking");
        return mapToResponse(booking);
    }

    @Transactional(readOnly = true)
    public BookingResponseDto getBookingByReference(String reference) {
        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with reference: " + reference));

        accessGuard.requireOwnerOrAdmin(booking.getUser(), "booking");

        return mapToResponse(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getAllBookings() {
        return bookingRepository.findAllWithDetails()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getBookingsByAirport(Long airportId) {
        return bookingRepository.findByAirportIdWithDetails(airportId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Booking findBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + id));
    }

    private String generateBookingReference() {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String uniquePart = UUID.randomUUID().toString().toUpperCase().replace("-", "").substring(0, 6);
        return String.format("BK-%s-%s", date, uniquePart);
    }

    private String formatDuration(Integer minutes) {
        if (minutes == null) return "";
        return (minutes / 60) + "h " + (minutes % 60) + "m";
    }

    public BookingResponseDto mapToResponse(Booking b) {
        FlightSchedule fs = b.getFlightSchedule();
        Flight f = fs.getFlight();

        List<PassengerResponseDto> passengerResponses = b.getPassengers()
                .stream()
                .map(p -> PassengerResponseDto.builder()
                        .id(p.getId())
                        .bookingId(b.getId())
                        .firstName(p.getFirstName())
                        .lastName(p.getLastName())
                        .gender(p.getGender().name())
                        .dateOfBirth(p.getDateOfBirth())
                        .idType(p.getIdType())
                        .idNumber(p.getIdNumber())
                        .seatNumber(p.getSeatNumber())
                        .build())
                .collect(Collectors.toList());

        PaymentResponseDto paymentResponse = null;
        if (b.getPayment() != null) {
            Payment pay = b.getPayment();
            paymentResponse = PaymentResponseDto.builder()
                    .id(pay.getId())
                    .transactionId(pay.getTransactionId())
                    .bookingId(b.getId())
                    .bookingReference(b.getBookingReference())
                    .amount(pay.getAmount())
                    .paymentMethod(pay.getPaymentMethod().name())
                    .status(pay.getStatus().name())
                    .failureReason(pay.getFailureReason())
                    .paidAt(pay.getPaidAt())
                    .createdAt(pay.getCreatedAt())
                    .build();
        }
        return BookingResponseDto.builder()
                .id(b.getId())
                .bookingReference(b.getBookingReference())
                .userId(b.getUser().getId())
                .userName(b.getUser().getFirstName() + " " + b.getUser().getLastName())
                .scheduleId(fs.getId())
                .flightNumber(f.getFlightNumber())
                .airlineName(f.getAirline().getName())
                .originCode(f.getOriginAirport().getCode())
                .originCity(f.getOriginAirport().getCity())
                .destinationCode(f.getDestinationAirport().getCode())
                .destinationCity(f.getDestinationAirport().getCity())
                .journeyDate(fs.getJourneyDate())
                .departureTime(fs.getDepartureTime())
                .arrivalTime(fs.getArrivalTime())
                .durationFormatted(formatDuration(f.getDurationMinutes()))
                .numberOfPassengers(b.getNumberOfPassengers())
                .pricePerPassenger(fs.getPrice())
                .totalAmount(b.getTotalAmount())
                .status(b.getStatus().name())
                .passengers(passengerResponses)
                .payment(paymentResponse)
                .createdAt(b.getCreatedAt())
                .updatedAt(b.getUpdatedAt())
                .build();
    }
}