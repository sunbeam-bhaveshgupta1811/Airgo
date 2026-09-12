package com.airline.reservation.controller;

import com.airline.reservation.repository.BookingRepository;
import com.airline.reservation.repository.PaymentRepository;
import com.airline.reservation.dto.*;
import com.airline.reservation.entity.Booking;
import com.airline.reservation.entity.Payment;
import com.airline.reservation.dto.request.BookingRequestDto;
import com.airline.reservation.dto.request.PassengerRequestDto;
import com.airline.reservation.dto.response.BookingResponseDto;
import com.airline.reservation.service.BookingService;
import com.airline.reservation.util.TicketPdfGenerator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class BookingController {

    private final BookingService bookingService;
    private final com.airline.reservation.service.RateLimitService rateLimitService;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final TicketPdfGenerator ticketPdfGenerator;
    private final com.airline.reservation.service.EmailService emailService;
    private final com.airline.reservation.security.AccessGuard accessGuard;

    @PostMapping("/bookings/create")
    public ResponseEntity<ApiResponse<BookingResponseDto>> createBooking(
            @Valid @RequestBody BookingRequestDto request,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        String userId = String.valueOf(httpRequest.getAttribute("userId"));
        if (userId == null || "null".equals(userId)) {
            userId = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication().getName();
        }
        if (!rateLimitService.resolveBookingBucket(userId).tryConsume(1)) {
            throw new com.airline.reservation.exception.RateLimitException(
                    "Too many booking requests. Please try again after 1 minute.");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking created successfully",
                        bookingService.createBooking(request)));
    }

    @PostMapping("/bookings/{id}/passengers")
    public ResponseEntity<ApiResponse<BookingResponseDto>> addPassengers(
            @PathVariable Long id,
            @Valid @RequestBody List<PassengerRequestDto> passengers) {
        return ResponseEntity.ok(ApiResponse.success("Passengers added successfully",
                bookingService.addPassengers(id, passengers)));
    }

    @GetMapping("/bookings/my")
    public ResponseEntity<ApiResponse<List<BookingResponseDto>>> getMyBookings() {
        return ResponseEntity.ok(ApiResponse.success("Bookings fetched successfully",
                bookingService.getMyBookings()));
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<ApiResponse<BookingResponseDto>> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Booking fetched successfully",
                bookingService.getBookingById(id)));
    }

    @GetMapping("/bookings/reference/{ref}")
    public ResponseEntity<ApiResponse<BookingResponseDto>> getByReference(@PathVariable String ref) {
        return ResponseEntity.ok(ApiResponse.success("Booking fetched successfully",
                bookingService.getBookingByReference(ref)));
    }

    @PatchMapping("/bookings/{id}/cancel")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }


    @GetMapping("/bookings/{id}/pdf")
    public ResponseEntity<byte[]> downloadTicketPdf(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new com.airline.reservation.exception.ResourceNotFoundException("Booking not found"));

        // Ensure user can only download their own ticket (or admin)
        accessGuard.requireOwnerOrAdmin(booking.getUser(), "ticket");

        Payment payment = paymentRepository.findByBookingId(id).orElse(null);
        byte[] pdfBytes = ticketPdfGenerator.generateTicket(booking, payment);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "ticket-" + booking.getBookingReference() + ".pdf");

        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }

    @PostMapping("/bookings/{id}/email")
    public ResponseEntity<ApiResponse<Void>> emailTicket(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new com.airline.reservation.exception.ResourceNotFoundException("Booking not found"));

        accessGuard.requireOwnerOrAdmin(booking.getUser(), "ticket");

        Payment payment = paymentRepository.findByBookingId(id).orElse(null);
        emailService.sendBookingConfirmationEmail(booking, payment);

        return ResponseEntity.ok(ApiResponse.success("Ticket emailed successfully", null));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponseDto>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.success("All bookings fetched",
                bookingService.getAllBookings()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/bookings/{id}")
    public ResponseEntity<ApiResponse<BookingResponseDto>> getAnyBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Booking fetched",
                bookingService.getBookingById(id)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/admin/bookings/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> adminCancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    @PreAuthorize("hasRole('AIRPORT_MANAGER')")
    @GetMapping("/manager/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponseDto>>> getBookingsByAirport(
            HttpServletRequest httpRequest) {
        Long airportId = (Long) httpRequest.getAttribute("airportId");
        if (airportId == null) {
            return ResponseEntity.ok(ApiResponse.success("No airport assigned", java.util.List.of()));
        }
        return ResponseEntity.ok(ApiResponse.success("Bookings fetched",
                bookingService.getBookingsByAirport(airportId)));
    }
}