package com.airline.controller;

import com.airline.dto.ApiResponse;
import com.airline.request.GateRequestDto;
import com.airline.response.GateResponseDto;
import com.airline.service.GateService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class GateController {

    private final GateService gateService;

    @PreAuthorize("hasAnyRole('ADMIN', 'AIRPORT_MANAGER')")
    @PostMapping("/api/gates")
    public ResponseEntity<ApiResponse<GateResponseDto>> addGate(
            @Valid @RequestBody GateRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Gate added successfully", gateService.addGate(request)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'AIRPORT_MANAGER')")
    @PutMapping("/api/gates/{id}")
    public ResponseEntity<ApiResponse<GateResponseDto>> updateGate(
            @PathVariable Long id, @Valid @RequestBody GateRequestDto request) {
        return ResponseEntity.ok(ApiResponse.success("Gate updated successfully", gateService.updateGate(id, request)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'AIRPORT_MANAGER')")
    @PatchMapping("/api/gates/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateGate(@PathVariable Long id) {
        return ResponseEntity.ok(gateService.deactivateGate(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'AIRPORT_MANAGER')")
    @PatchMapping("/api/gates/{id}/reactivate")
    public ResponseEntity<ApiResponse<Void>> reactivateGate(@PathVariable Long id) {
        return ResponseEntity.ok(gateService.reactivateGate(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'AIRPORT_MANAGER')")
    @GetMapping("/api/gates/terminal/{terminalId}")
    public ResponseEntity<ApiResponse<List<GateResponseDto>>> getGatesByTerminal(@PathVariable Long terminalId) {
        return ResponseEntity.ok(ApiResponse.success("Gates fetched", gateService.getGatesByTerminal(terminalId)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'AIRPORT_MANAGER')")
    @GetMapping("/api/gates/airport/{airportId}")
    public ResponseEntity<ApiResponse<List<GateResponseDto>>> getGatesByAirport(@PathVariable Long airportId) {
        return ResponseEntity.ok(ApiResponse.success("Gates fetched", gateService.getGatesByAirport(airportId)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'AIRPORT_MANAGER')")
    @GetMapping("/api/gates/{id}")
    public ResponseEntity<ApiResponse<GateResponseDto>> getGateById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Gate fetched", gateService.getGateById(id)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/gates")
    public ResponseEntity<ApiResponse<List<GateResponseDto>>> getAllGates() {
        return ResponseEntity.ok(ApiResponse.success("All gates fetched", gateService.getAllGates()));
    }
}
