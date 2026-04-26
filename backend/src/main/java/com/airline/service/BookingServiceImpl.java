package com.airline.service;

import com.airline.dao.*;
import com.airline.dto.ApiResponse;
import com.airline.entity.*;
import com.airline.exception.*;
import com.airline.request.BookingRequestDto;
import com.airline.request.PassengerRequestDto;
import com.airline.response.BookingResponseDto;
import com.airline.response.PassengerResponseDto;
import com.airline.response.PaymentResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService{

    private final BookingDao bookingDao;
    private final UserDao userDao;
    private final FlightScheduleDao scheduleDao;
    private final PassengerDao passengerDao;
    private final PaymentDao paymentDao;
    private final EmailService emailService;

    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto request) {

        User user = getLoggedInUser();

        FlightSchedule schedule = scheduleDao.findById(request.getScheduleId())
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

        if (bookingDao.existsByUserIdAndFlightScheduleIdAndStatusNot(
                user.getId(), schedule.getId(), BookingStatus.CANCELLED)) {
            throw new DuplicateResourceException(
                    "You have already booked this flight");
        }

        BigDecimal totalAmount = schedule.getPrice()
                .multiply(BigDecimal.valueOf(request.getNumberOfPassengers()));

        String bookingRef = generateBookingReference();

        schedule.setAvailableSeats(schedule.getAvailableSeats() - request.getNumberOfPassengers());
        scheduleDao.save(schedule);

        Booking booking = Booking.builder()
                .bookingReference(bookingRef)
                .user(user)
                .flightSchedule(schedule)
                .numberOfPassengers(request.getNumberOfPassengers())
                .totalAmount(totalAmount)
                .status(BookingStatus.PENDING)
                .build();

        Booking saved = bookingDao.save(booking);
        log.info("Booking created: {} by user {}", bookingRef, user.getEmail());

        return mapToResponse(saved);
    }

    @Transactional
    public BookingResponseDto addPassengers(Long bookingId, List<PassengerRequestDto> requests) {

        User user = getLoggedInUser();
        Booking booking = findBookingById(bookingId);

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You are not authorized to modify this booking");
        }

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

        List<Passenger> existing = passengerDao.findByBookingId(bookingId);
        if (!existing.isEmpty()) {
            passengerDao.deleteAll(existing);
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

        passengerDao.saveAll(passengers);
        log.info("Passengers added to booking {}", booking.getBookingReference());

        Booking refreshed = findBookingById(bookingId);
        return mapToResponse(refreshed);
    }

    @Transactional
    public ApiResponse<Void> cancelBooking(Long bookingId) {

        User user = getLoggedInUser();
        Booking booking = findBookingById(bookingId);

        boolean isAdmin = user.getRole() == Role.ADMIN;
        if (!isAdmin && !booking.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You are not authorized to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed booking");
        }

        FlightSchedule schedule = booking.getFlightSchedule();
        schedule.setAvailableSeats(
                schedule.getAvailableSeats() + booking.getNumberOfPassengers());
        scheduleDao.save(schedule);

        booking.setStatus(BookingStatus.CANCELLED);
        bookingDao.save(booking);

        Payment payment = paymentDao.findByBookingId(bookingId).orElse(null);
        emailService.sendBookingCancellationEmail(booking, payment);

        log.info("Booking {} cancelled by {}", booking.getBookingReference(), user.getEmail());
        return ApiResponse.success(
                "Booking " + booking.getBookingReference() + " cancelled successfully", null);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getMyBookings() {
        User user = getLoggedInUser();
        return bookingDao.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponseDto getBookingById(Long id) {
        User user = getLoggedInUser();
        Booking booking = findBookingById(id);

        if (user.getRole() != Role.ADMIN
                && !booking.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You are not authorized to view this booking");
        }
        return mapToResponse(booking);
    }

    @Transactional(readOnly = true)
    public BookingResponseDto getBookingByReference(String reference) {
        Booking booking = bookingDao.findByBookingReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with reference: " + reference));
        return mapToResponse(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDto> getAllBookings() {
        return bookingDao.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userDao.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Booking findBookingById(Long id) {
        return bookingDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + id));
    }

    private String generateBookingReference() {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = bookingDao.count() + 1;
        return String.format("BK-%s-%05d", date, count);
    }

    private String formatDuration(Integer minutes) {
        if (minutes == null) return "";
        return (minutes / 60) + "h " + (minutes % 60) + "m";
    }

    public BookingResponseDto mapToResponse(Booking b) {
        FlightSchedule fs = b.getFlightSchedule();
        Flight f = fs.getFlight();

        List<PassengerResponseDto> passengerResponses = passengerDao
                .findByBookingId(b.getId())
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