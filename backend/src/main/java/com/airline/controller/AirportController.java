package com.airline.controller;

import com.airline.dto.ApiResponse;
import com.airline.request.AirportRequestDto;
import com.airline.response.AirportResponseDto;
import com.airline.service.AirportService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/airports")
public class AirportController {

    private final AirportService airportService;

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<AirportResponseDto>> addAirport(
            @Valid @RequestBody AirportRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Airport added successfully",
                        airportService.addAirport(request)));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<AirportResponseDto>> updateAirport(
            @PathVariable Long id, @Valid @RequestBody AirportRequestDto request) {
        return ResponseEntity.ok(ApiResponse.success("Airport updated successfully",
                airportService.updateAirport(id, request)));
    }

    @PatchMapping("/{id}/deactivate")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Void>> deactivateAirport(@PathVariable Long id) {
        return ResponseEntity.ok(airportService.deactivateAirport(id));
    }

    @PatchMapping("/{id}/reactivate")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Void>> reactivateAirport(@PathVariable Long id) {
        return ResponseEntity.ok(airportService.reactivateAirport(id));
    }

    @GetMapping
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<List<AirportResponseDto>>> getAllAirports() {
        return ResponseEntity.ok(ApiResponse.success("Airports fetched",
                airportService.getAllAirports()));
    }


    @GetMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<AirportResponseDto>> getAirportById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Airport fetched",
                airportService.getAirportById(id)));
    }
}