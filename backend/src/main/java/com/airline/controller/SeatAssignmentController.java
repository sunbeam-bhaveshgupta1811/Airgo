package com.airline.controller;

import com.airline.dto.ApiResponse;
import com.airline.response.SeatAssignmentResponse;
import com.airline.response.SeatMapResponse;
import com.airline.service.SeatAssignmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class SeatAssignmentController {

    private final SeatAssignmentService seatAssignmentService;

    @GetMapping("user/bookings/{bookingId}/seats")
    public ResponseEntity<ApiResponse<List<SeatAssignmentResponse>>> getMySeatAssignments(
            @PathVariable Long bookingId) {
        return ResponseEntity.ok(ApiResponse.success("Seat assignments fetched",
                seatAssignmentService.getSeatAssignmentsByBooking(bookingId)));
    }

    @PostMapping("/admin/seats/assign/{bookingId}")
    @Operation(summary = "Manually trigger seat assignment for a booking — ADMIN only")
    public ResponseEntity<ApiResponse<List<SeatAssignmentResponse>>> assignSeatsForBooking(
            @PathVariable Long bookingId) {

        seatAssignmentService.reassignSeats(bookingId);

        return ResponseEntity.ok(ApiResponse.success("Seats assigned successfully",
                seatAssignmentService.getSeatAssignmentsByBooking(bookingId)));
    }

    @PatchMapping("/admin/seats/passenger/{passengerId}")
    public ResponseEntity<ApiResponse<SeatAssignmentResponse>> assignSpecificSeat(
            @PathVariable Long passengerId,
            @RequestParam String seat) {

        SeatAssignmentResponse response = seatAssignmentService
                .assignSeatToPassenger(passengerId, seat);
        return ResponseEntity.ok(ApiResponse.success("Seat assigned", response));
    }

    @PatchMapping("/admin/seats/reassign/{bookingId}")
    public ResponseEntity<ApiResponse<Void>> reassignSeats(@PathVariable Long bookingId) {
        return ResponseEntity.ok(seatAssignmentService.reassignSeats(bookingId));
    }

    @GetMapping("/admin/seats/map/{scheduleId}")
    public ResponseEntity<ApiResponse<SeatMapResponse>> getSeatMap(
            @PathVariable Long scheduleId) {
        return ResponseEntity.ok(ApiResponse.success("Seat map fetched",
                seatAssignmentService.getSeatMap(scheduleId)));
    }

    @GetMapping("/admin/seats/booking/{bookingId}")
    public ResponseEntity<ApiResponse<List<SeatAssignmentResponse>>> getSeatsByBooking(
            @PathVariable Long bookingId) {
        return ResponseEntity.ok(ApiResponse.success("Seat assignments fetched",
                seatAssignmentService.getSeatAssignmentsByBooking(bookingId)));
    }
}