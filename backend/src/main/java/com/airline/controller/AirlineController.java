package com.airline.controller;

import com.airline.dto.ApiResponse;
import com.airline.request.AirlineRequestDto;
import com.airline.response.AirlineResponseDto;
import com.airline.service.AirlineService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/airlines")
@RequiredArgsConstructor
public class AirlineController {

    private final AirlineService airlineService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<AirlineResponseDto>> addAirline(@Valid @RequestBody AirlineRequestDto request) {

        AirlineResponseDto response = airlineService.addAirline(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Airline added successfully", response));
    }



    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<AirlineResponseDto>> updateAirline(@PathVariable Long id,
            @Valid @RequestBody AirlineRequestDto request) {

        AirlineResponseDto response = airlineService.updateAirline(id, request);
        return ResponseEntity.ok(ApiResponse.success("Airline updated successfully", response));
    }




    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Void>> deactivateAirline(@PathVariable Long id) {
        return ResponseEntity.ok(airlineService.deactivateAirline(id));
    }




    @PatchMapping("/{id}/reactivate")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Void>> reactivateAirline(@PathVariable Long id) {
        return ResponseEntity.ok(airlineService.reactivateAirline(id));
    }


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<List<AirlineResponseDto>>> getAllAirlines() {
        return ResponseEntity.ok(
                ApiResponse.success("Airlines fetched successfully", airlineService.getAllAirlines()));
    }



    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<AirlineResponseDto>> getAirlineById(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Airline fetched successfully",
                        airlineService.getAirlineById(id)));
    }
}