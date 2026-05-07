package com.airline.controller;

import com.airline.dto.*;
import com.airline.request.BookingRequestDto;
import com.airline.request.PassengerRequestDto;
import com.airline.response.BookingResponseDto;
import com.airline.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class BookingController {

    private final BookingService bookingService;

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


    @GetMapping("/admin/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponseDto>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.success("All bookings fetched",
                bookingService.getAllBookings()));
    }

    @GetMapping("/admin/bookings/{id}")
    public ResponseEntity<ApiResponse<BookingResponseDto>> getAnyBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Booking fetched",
                bookingService.getBookingById(id)));
    }

    @PatchMapping("/admin/bookings/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> adminCancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }
}