package com.airline.controller;

import com.airline.dto.*;
import com.airline.request.FlightScheduleRequestDto;
import com.airline.request.FlightSearchRequestDto;
import com.airline.response.FlightScheduleResponseDto;
import com.airline.service.FlightScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class FlightScheduleController {

    private final FlightScheduleService scheduleService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/schedules")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<FlightScheduleResponseDto>> addSchedule(
            @Valid @RequestBody FlightScheduleRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Schedule added successfully",
                        scheduleService.addSchedule(request)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/schedules/{id}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<FlightScheduleResponseDto>> updateSchedule(
            @PathVariable Long id,
            @Valid @RequestBody FlightScheduleRequestDto request) {
        return ResponseEntity.ok(ApiResponse.success("Schedule updated successfully",
                scheduleService.updateSchedule(id, request)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/admin/schedules/{id}/cancel")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Void>> cancelSchedule(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.cancelSchedule(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/admin/schedules/{id}/status")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<FlightScheduleResponseDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success("Status updated",
                scheduleService.updateScheduleStatus(id, status)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/schedules")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<List<FlightScheduleResponseDto>>> getAllSchedules() {
        return ResponseEntity.ok(ApiResponse.success("Schedules fetched",
                scheduleService.getAllSchedules()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/schedules/flight/{flightId}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<List<FlightScheduleResponseDto>>> getByFlight(
            @PathVariable Long flightId) {
        return ResponseEntity.ok(ApiResponse.success("Schedules fetched",
                scheduleService.getSchedulesByFlight(flightId)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/schedules/{id}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<FlightScheduleResponseDto>> getScheduleById(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Schedule fetched",
                scheduleService.getScheduleById(id)));
    }

    @PostMapping("/api/flights/search")
    public ResponseEntity<ApiResponse<List<FlightScheduleResponseDto>>> searchFlights(
            @Valid @RequestBody FlightSearchRequestDto request) {
        return ResponseEntity.ok(ApiResponse.success("Flights found",
                scheduleService.searchFlights(request)));
    }

    @GetMapping("/api/flights/schedules/{id}")
    @Operation(summary = "Get schedule details by ID — Public")
    public ResponseEntity<ApiResponse<FlightScheduleResponseDto>> getSchedulePublic(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Schedule fetched",
                scheduleService.getScheduleById(id)));
    }

    @GetMapping("/api/flights/schedules/flight/{flightId}")
    public ResponseEntity<ApiResponse<List<FlightScheduleResponseDto>>> getSchedulesByFlightPublic(
            @PathVariable Long flightId) {
        return ResponseEntity.ok(ApiResponse.success("Schedules fetched",
                scheduleService.getSchedulesByFlight(flightId)));
    }
}