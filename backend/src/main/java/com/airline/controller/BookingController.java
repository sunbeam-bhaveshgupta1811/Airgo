package com.airline.controller;

import com.airline.dao.BookingDao;
import com.airline.dao.PaymentDao;
import com.airline.dto.*;
import com.airline.entity.Booking;
import com.airline.entity.Payment;
import com.airline.request.BookingRequestDto;
import com.airline.request.PassengerRequestDto;
import com.airline.response.BookingResponseDto;
import com.airline.service.BookingService;
import com.airline.util.TicketPdfGenerator;
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
    private final BookingDao bookingDao;
    private final PaymentDao paymentDao;
    private final TicketPdfGenerator ticketPdfGenerator;

    @PostMapping("/bookings/create")
    public ResponseEntity<ApiResponse<BookingResponseDto>> createBooking(
            @Valid @RequestBody BookingRequestDto request) {
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
        Booking booking = bookingDao.findById(id)
                .orElseThrow(() -> new com.airline.exception.ResourceNotFoundException("Booking not found"));

        // Ensure user can only download their own ticket (or admin)
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        if (!booking.getUser().getEmail().equals(email)) {
            throw new com.airline.exception.BadRequestException("Not authorized to download this ticket");
        }

        Payment payment = paymentDao.findByBookingId(id).orElse(null);
        byte[] pdfBytes = ticketPdfGenerator.generateTicket(booking, payment);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "ticket-" + booking.getBookingReference() + ".pdf");

        return ResponseEntity.ok().headers(headers).body(pdfBytes);
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
            throw new com.airline.exception.BadRequestException("No airport assigned to this manager");
        }
        return ResponseEntity.ok(ApiResponse.success("Bookings fetched",
                bookingService.getBookingsByAirport(airportId)));
    }
}