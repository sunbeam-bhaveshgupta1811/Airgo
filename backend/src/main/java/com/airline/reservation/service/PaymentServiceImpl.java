package com.airline.reservation.service;

import com.airline.reservation.repository.*;
import com.airline.reservation.entity.*;
import com.airline.reservation.exception.BadRequestException;
import com.airline.reservation.exception.DuplicateResourceException;
import com.airline.reservation.exception.ResourceNotFoundException;
import com.airline.reservation.dto.request.PaymentRequestDto;
import com.airline.reservation.dto.response.PaymentResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final PassengerRepository passengerRepository;
    private final FlightScheduleRepository scheduleRepository;
    private final SeatAssignmentService seatAssignmentService;
    private final EmailService emailService;
    private final SeatBroadcastService seatBroadcastService;
    private final BookingCancellationService cancellationService;
    private final com.airline.reservation.security.AccessGuard accessGuard;

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private KafkaProducerService kafkaProducerService;

    @Transactional
    public PaymentResponseDto makePayment(PaymentRequestDto request) {

        User user = getLoggedInUser();

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + request.getBookingId()));

        accessGuard.requireOwner(booking.getUser(), "booking");

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException(
                    "Cannot process payment for a "
                            + booking.getStatus().name().toLowerCase() + " booking");
        }

        int passengerCount = passengerRepository.countByBookingId(booking.getId());
        if (passengerCount != booking.getNumberOfPassengers()) {
            throw new BadRequestException(
                    "Please add all passengers before making payment. "
                            + "Expected: " + booking.getNumberOfPassengers()
                            + ", Added: " + passengerCount);
        }

        if (paymentRepository.existsByBookingId(booking.getId())) {
            throw new DuplicateResourceException(
                    "Payment already exists for booking: " + booking.getBookingReference());
        }

        PaymentMethod paymentMethod;
        try {
            paymentMethod = PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException(
                    "Invalid payment method: " + request.getPaymentMethod()
                            + ". Allowed: CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING, WALLET");
        }

        String transactionId = "TXN-" + UUID.randomUUID().toString()
                .toUpperCase().replace("-", "").substring(0, 12);

        PaymentStatus paymentStatus = simulatePaymentGateway(paymentMethod);

        Payment payment = Payment.builder()
                .transactionId(transactionId)
                .booking(booking)
                .amount(booking.getTotalAmount())
                .paymentMethod(paymentMethod)
                .status(paymentStatus)
                .paidAt(paymentStatus == PaymentStatus.SUCCESS ? LocalDateTime.now() : null)
                .failureReason(paymentStatus == PaymentStatus.FAILED
                        ? "Payment declined by gateway" : null)
                .build();

        Payment saved = paymentRepository.save(payment);

        if (paymentStatus == PaymentStatus.SUCCESS) {
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);

            seatAssignmentService.assignSeats(booking);
            seatBroadcastService.broadcastSeatUpdate(booking.getFlightSchedule().getId());

            emailService.sendBookingConfirmationEmail(booking, saved);

            log.info("Payment SUCCESS + seats assigned for booking {}",
                    booking.getBookingReference());
        } else {
            cancellationService.cancelAndReleaseSeats(booking);
            seatBroadcastService.broadcastSeatUpdate(booking.getFlightSchedule().getId());

//            emailService.sendPaymentFailedEmail(booking, saved);

            log.warn("Payment FAILED for booking {}", booking.getBookingReference());
        }

        // Publish Kafka payment event
        com.airline.reservation.event.PaymentEvent paymentEvent = com.airline.reservation.event.PaymentEvent.builder()
                .paymentId(saved.getId())
                .transactionId(transactionId)
                .bookingId(booking.getId())
                .bookingReference(booking.getBookingReference())
                .eventType(paymentStatus.name())
                .userEmail(user.getEmail())
                .userName(user.getFirstName() + " " + user.getLastName())
                .flightNumber(booking.getFlightSchedule().getFlight().getFlightNumber())
                .amount(booking.getTotalAmount())
                .paymentMethod(paymentMethod.name())
                .failureReason(paymentStatus == PaymentStatus.FAILED ? "Payment declined by gateway" : null)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        if (kafkaProducerService != null) kafkaProducerService.publishPaymentEvent(paymentEvent);

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public PaymentResponseDto getPaymentByBookingId(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + bookingId));

        accessGuard.requireOwnerOrAdmin(booking.getUser(), "payment");

        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found for booking id: " + bookingId));

        return mapToResponse(payment);
    }

    @Transactional(readOnly = true)
    public PaymentResponseDto getPaymentByTransactionId(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found with transaction id: " + transactionId));
        return mapToResponse(payment);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponseDto> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentResponseDto refundPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found with id: " + paymentId));

        if (payment.getStatus() == PaymentStatus.REFUNDED) {
            throw new BadRequestException(
                    "Payment has already been refunded. Transaction: "
                            + payment.getTransactionId());
        }

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new BadRequestException(
                    "Can only refund successful payments. Current status: "
                            + payment.getStatus().name());
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        paymentRepository.save(payment);

        Booking booking = payment.getBooking();

        // Idempotent: if the customer already cancelled, the seats were returned then and
        // must not be returned a second time. Previously both paths incremented
        // availableSeats independently, silently overselling the flight.
        boolean cancelledNow = cancellationService.cancelAndReleaseSeats(booking);
        if (cancelledNow) {
            seatBroadcastService.broadcastSeatUpdate(booking.getFlightSchedule().getId());
        }
        emailService.sendBookingCancellationEmail(booking, payment);

        // Publish Kafka refund event
        com.airline.reservation.event.PaymentEvent refundEvent = com.airline.reservation.event.PaymentEvent.builder()
                .paymentId(payment.getId())
                .transactionId(payment.getTransactionId())
                .bookingId(booking.getId())
                .bookingReference(booking.getBookingReference())
                .eventType("REFUNDED")
                .userEmail(booking.getUser().getEmail())
                .userName(booking.getUser().getFirstName() + " " + booking.getUser().getLastName())
                .flightNumber(booking.getFlightSchedule().getFlight().getFlightNumber())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod().name())
                .timestamp(java.time.LocalDateTime.now())
                .build();
        if (kafkaProducerService != null) kafkaProducerService.publishPaymentEvent(refundEvent);

        log.info("Payment {} refunded for booking {}",
                payment.getTransactionId(), booking.getBookingReference());
        return mapToResponse(payment);
    }

    private PaymentStatus simulatePaymentGateway(PaymentMethod method) {
        // Simulate ~10% failure rate like a real gateway
        double random = Math.random();
        if (random < 0.10) {
            log.warn("Simulated payment gateway declined transaction for method: {}", method);
            return PaymentStatus.FAILED;
        }
        return PaymentStatus.SUCCESS;
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public PaymentResponseDto mapToResponse(Payment p) {
        return PaymentResponseDto.builder()
                .id(p.getId())
                .transactionId(p.getTransactionId())
                .bookingId(p.getBooking().getId())
                .bookingReference(p.getBooking().getBookingReference())
                .amount(p.getAmount())
                .paymentMethod(p.getPaymentMethod().name())
                .status(p.getStatus().name())
                .failureReason(p.getFailureReason())
                .paidAt(p.getPaidAt())
                .createdAt(p.getCreatedAt())
                .build();
    }
}