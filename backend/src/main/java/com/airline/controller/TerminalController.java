package com.airline.controller;

import com.airline.dto.ApiResponse;
import com.airline.request.TerminalRequestDto;
import com.airline.response.TerminalResponseDto;
import com.airline.service.TerminalService;
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
public class TerminalController {

    private final TerminalService terminalService;

    @PreAuthorize("hasAnyRole('ADMIN', 'AIRPORT_MANAGER')")
    @PostMapping("/api/terminals")
    public ResponseEntity<ApiResponse<TerminalResponseDto>> addTerminal(
            @Valid @RequestBody TerminalRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Terminal added successfully", terminalService.addTerminal(request)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'AIRPORT_MANAGER')")
    @PutMapping("/api/terminals/{id}")
    public ResponseEntity<ApiResponse<TerminalResponseDto>> updateTerminal(
            @PathVariable Long id, @Valid @RequestBody TerminalRequestDto request) {
        return ResponseEntity.ok(ApiResponse.success("Terminal updated successfully", terminalService.updateTerminal(id, request)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'AIRPORT_MANAGER')")
    @PatchMapping("/api/terminals/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateTerminal(@PathVariable Long id) {
        return ResponseEntity.ok(terminalService.deactivateTerminal(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'AIRPORT_MANAGER')")
    @PatchMapping("/api/terminals/{id}/reactivate")
    public ResponseEntity<ApiResponse<Void>> reactivateTerminal(@PathVariable Long id) {
        return ResponseEntity.ok(terminalService.reactivateTerminal(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'AIRPORT_MANAGER')")
    @GetMapping("/api/terminals/airport/{airportId}")
    public ResponseEntity<ApiResponse<List<TerminalResponseDto>>> getTerminalsByAirport(@PathVariable Long airportId) {
        return ResponseEntity.ok(ApiResponse.success("Terminals fetched", terminalService.getTerminalsByAirport(airportId)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'AIRPORT_MANAGER')")
    @GetMapping("/api/terminals/{id}")
    public ResponseEntity<ApiResponse<TerminalResponseDto>> getTerminalById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Terminal fetched", terminalService.getTerminalById(id)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/terminals")
    public ResponseEntity<ApiResponse<List<TerminalResponseDto>>> getAllTerminals() {
        return ResponseEntity.ok(ApiResponse.success("All terminals fetched", terminalService.getAllTerminals()));
    }
}
