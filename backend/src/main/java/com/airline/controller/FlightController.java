package com.airline.controller;

import com.airline.dto.*;
import com.airline.request.FlightRequestDto;
import com.airline.response.FlightResponseDto;
import com.airline.service.FlightService;
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
public class FlightController {

    private final FlightService flightService;

    @PostMapping("/admin/flights")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<FlightResponseDto>> addFlight(
            @Valid @RequestBody FlightRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Flight added successfully",
                        flightService.addFlight(request)));
    }

    @PutMapping("/admin/flights/{id}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<FlightResponseDto>> updateFlight(
            @PathVariable Long id,
            @Valid @RequestBody FlightRequestDto request) {
        return ResponseEntity.ok(ApiResponse.success("Flight updated successfully",
                flightService.updateFlight(id, request)));
    }

    @PatchMapping("/admin/flights/{id}/deactivate")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Void>> deactivateFlight(@PathVariable Long id) {
        return ResponseEntity.ok(flightService.deactivateFlight(id));
    }

    @PatchMapping("/admin/flights/{id}/reactivate")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Void>> reactivateFlight(@PathVariable Long id) {
        return ResponseEntity.ok(flightService.reactivateFlight(id));
    }

    @GetMapping("/admin/flights")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<List<FlightResponseDto>>> getAllFlights() {
        return ResponseEntity.ok(ApiResponse.success("Flights fetched",
                flightService.getAllFlights()));
    }

    @GetMapping("/admin/flights/airline/{airlineId}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<List<FlightResponseDto>>> getFlightsByAirline(
            @PathVariable Long airlineId) {
        return ResponseEntity.ok(ApiResponse.success("Flights fetched",
                flightService.getFlightsByAirline(airlineId)));
    }

    @GetMapping("/user/flights")
    public ResponseEntity<ApiResponse<List<FlightResponseDto>>> getActiveFlights() {
        return ResponseEntity.ok(ApiResponse.success("Active flights fetched",
                flightService.getActiveFlights()));
    }

    @GetMapping("/user/flights/{id}")
    public ResponseEntity<ApiResponse<FlightResponseDto>> getFlightById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Flight fetched",
                flightService.getFlightById(id)));
    }
}