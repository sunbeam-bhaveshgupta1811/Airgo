package com.airline.service;

import com.airline.dao.BookingDao;
import com.airline.dao.PassengerDao;
import com.airline.dao.PaymentDao;
import com.airline.dao.UserDao;
import com.airline.entity.*;
import com.airline.exception.BadRequestException;
import com.airline.exception.DuplicateResourceException;
import com.airline.exception.ResourceNotFoundException;
import com.airline.request.PaymentRequestDto;
import com.airline.response.PaymentResponseDto;
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

    private final PaymentDao paymentDao;
    private final BookingDao bookingDao;
    private final UserDao userDao;
    private final PassengerDao passengerDao;
    private final SeatAssignmentService seatAssignmentService;
    private final EmailService emailService;

    @Transactional
    public PaymentResponseDto makePayment(PaymentRequestDto request) {

        User user = getLoggedInUser();

        Booking booking = bookingDao.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + request.getBookingId()));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You are not authorized to pay for this booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException(
                    "Cannot process payment for a "
                            + booking.getStatus().name().toLowerCase() + " booking");
        }

        int passengerCount = passengerDao.countByBookingId(booking.getId());
        if (passengerCount != booking.getNumberOfPassengers()) {
            throw new BadRequestException(
                    "Please add all passengers before making payment. "
                            + "Expected: " + booking.getNumberOfPassengers()
                            + ", Added: " + passengerCount);
        }

        if (paymentDao.existsByBookingId(booking.getId())) {
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

        Payment saved = paymentDao.save(payment);

        if (paymentStatus == PaymentStatus.SUCCESS) {
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingDao.save(booking);

            seatAssignmentService.assignSeats(booking);

            emailService.sendBookingConfirmationEmail(booking, saved);

            log.info("Payment SUCCESS + seats assigned for booking {}",
                    booking.getBookingReference());
        } else {
            FlightSchedule schedule = booking.getFlightSchedule();
            schedule.setAvailableSeats(
                    schedule.getAvailableSeats() + booking.getNumberOfPassengers());
            booking.setStatus(BookingStatus.CANCELLED);
            bookingDao.save(booking);

//            emailService.sendPaymentFailedEmail(booking, saved);

            log.warn("Payment FAILED for booking {}", booking.getBookingReference());
        }

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public PaymentResponseDto getPaymentByBookingId(Long bookingId) {
        User user = getLoggedInUser();
        Booking booking = bookingDao.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + bookingId));

        if (user.getRole() != Role.ADMIN
                && !booking.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You are not authorized to view this payment");
        }

        Payment payment = paymentDao.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found for booking id: " + bookingId));

        return mapToResponse(payment);
    }

    @Transactional(readOnly = true)
    public PaymentResponseDto getPaymentByTransactionId(String transactionId) {
        Payment payment = paymentDao.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found with transaction id: " + transactionId));
        return mapToResponse(payment);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponseDto> getAllPayments() {
        return paymentDao.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentResponseDto refundPayment(Long paymentId) {
        Payment payment = paymentDao.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found with id: " + paymentId));

        if (payment.getStatus() != PaymentStatus.SUCCESS) {
            throw new BadRequestException(
                    "Can only refund successful payments. Current status: "
                            + payment.getStatus().name());
        }

        payment.setStatus(PaymentStatus.REFUNDED);
        paymentDao.save(payment);

        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.CANCELLED);
        bookingDao.save(booking);

        FlightSchedule schedule = booking.getFlightSchedule();
        schedule.setAvailableSeats(
                schedule.getAvailableSeats() + booking.getNumberOfPassengers());

        emailService.sendBookingCancellationEmail(booking, payment);

        log.info("Payment {} refunded for booking {}",
                payment.getTransactionId(), booking.getBookingReference());
        return mapToResponse(payment);
    }

    private PaymentStatus simulatePaymentGateway(PaymentMethod method) {
        return PaymentStatus.SUCCESS;
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userDao.findByEmail(email)
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