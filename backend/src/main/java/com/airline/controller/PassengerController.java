package com.airline.controller;

import com.airline.dto.*;
import com.airline.response.PassengerResponseDto;
import com.airline.service.PassengerService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class PassengerController {

    private final PassengerService passengerService;

    @GetMapping("/bookings/{bookingId}/passengers")
    public ResponseEntity<ApiResponse<List<PassengerResponseDto>>> getPassengersByBooking(
            @PathVariable Long bookingId) {
        return ResponseEntity.ok(ApiResponse.success("Passengers fetched",
                passengerService.getPassengersByBooking(bookingId)));
    }

    @GetMapping("/passengers/{id}")
    public ResponseEntity<ApiResponse<PassengerResponseDto>> getPassengerById(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Passenger fetched",
                passengerService.getPassengerById(id)));
    }

    @GetMapping("/admin/passengers")
    public ResponseEntity<ApiResponse<List<PassengerResponseDto>>> getAllPassengers() {
        return ResponseEntity.ok(ApiResponse.success("All passengers fetched",
                passengerService.getAllPassengers()));
    }

    @GetMapping("/admin/passengers/schedule/{scheduleId}")
    public ResponseEntity<ApiResponse<List<PassengerResponseDto>>> getPassengersBySchedule(
            @PathVariable Long scheduleId) {
        return ResponseEntity.ok(ApiResponse.success("Passengers fetched",
                passengerService.getAllPassengersForSchedule(scheduleId)));
    }

    @GetMapping("/admin/bookings/{bookingId}/passengers")
    public ResponseEntity<ApiResponse<List<PassengerResponseDto>>> getPassengersForAnyBooking(
            @PathVariable Long bookingId) {
        return ResponseEntity.ok(ApiResponse.success("Passengers fetched",
                passengerService.getPassengersByBooking(bookingId)));
    }
}