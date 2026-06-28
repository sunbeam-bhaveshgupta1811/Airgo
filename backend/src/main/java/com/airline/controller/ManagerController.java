package com.airline.controller;

import com.airline.dao.FlightDao;
import com.airline.dao.GateDao;
import com.airline.dao.TerminalDao;
import com.airline.dto.ApiResponse;
import com.airline.entity.Flight;
import com.airline.exception.BadRequestException;
import com.airline.exception.ResourceNotFoundException;
import com.airline.request.AirlineRequestDto;
import com.airline.request.FlightRequestDto;
import com.airline.response.*;
import com.airline.service.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/manager")
@PreAuthorize("hasRole('AIRPORT_MANAGER')")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class ManagerController {

    private final TerminalService terminalService;
    private final GateService gateService;
    private final AirportService airportService;
    private final AirlineService airlineService;
    private final FlightService flightService;
    private final TerminalDao terminalDao;
    private final GateDao gateDao;
    private final FlightDao flightDao;

    @GetMapping("/my-airport")
    public ResponseEntity<ApiResponse<AirportResponseDto>> getMyAirport(HttpServletRequest request) {
        Long airportId = getAirportId(request);
        return ResponseEntity.ok(ApiResponse.success("Airport fetched", airportService.getAirportById(airportId)));
    }

    @GetMapping("/terminals")
    public ResponseEntity<ApiResponse<List<TerminalResponseDto>>> getMyTerminals(HttpServletRequest request) {
        Long airportId = getAirportId(request);
        return ResponseEntity.ok(ApiResponse.success("Terminals fetched", terminalService.getTerminalsByAirport(airportId)));
    }

    @GetMapping("/gates")
    public ResponseEntity<ApiResponse<List<GateResponseDto>>> getMyGates(HttpServletRequest request) {
        Long airportId = getAirportId(request);
        return ResponseEntity.ok(ApiResponse.success("Gates fetched", gateService.getGatesByAirport(airportId)));
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats(HttpServletRequest request) {
        Long airportId = getAirportId(request);
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("terminalCount", terminalDao.findByAirportId(airportId).size());
        stats.put("gateCount", gateDao.findByAirportId(airportId).size());
        stats.put("airportInfo", airportService.getAirportById(airportId));
        return ResponseEntity.ok(ApiResponse.success("Manager dashboard stats", stats));
    }

    // ===== AIRLINE MANAGEMENT =====

    @GetMapping("/airlines")
    public ResponseEntity<ApiResponse<List<AirlineResponseDto>>> getAirlines() {
        return ResponseEntity.ok(ApiResponse.success("Airlines fetched", airlineService.getAllAirlines()));
    }

    @PostMapping("/airlines")
    public ResponseEntity<ApiResponse<AirlineResponseDto>> addAirline(
            @Valid @RequestBody AirlineRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Airline added successfully", airlineService.addAirline(request)));
    }

    @PutMapping("/airlines/{id}")
    public ResponseEntity<ApiResponse<AirlineResponseDto>> updateAirline(
            @PathVariable Long id,
            @Valid @RequestBody AirlineRequestDto request) {
        return ResponseEntity.ok(ApiResponse.success("Airline updated", airlineService.updateAirline(id, request)));
    }

    // ===== FLIGHT MANAGEMENT (scoped to manager's airport) =====

    @GetMapping("/flights")
    public ResponseEntity<ApiResponse<List<FlightResponseDto>>> getMyFlights(HttpServletRequest request) {
        Long airportId = getAirportId(request);
        List<Flight> flights = flightDao.findByAirportId(airportId);
        List<FlightResponseDto> dtos = flights.stream()
                .map(f -> FlightResponseDto.builder()
                        .id(f.getId())
                        .flightNumber(f.getFlightNumber())
                        .airlineId(f.getAirline().getId())
                        .airlineName(f.getAirline().getName())
                        .airlineCode(f.getAirline().getCode())
                        .originAirportId(f.getOriginAirport().getId())
                        .originAirportCode(f.getOriginAirport().getCode())
                        .originCity(f.getOriginAirport().getCity())
                        .destinationAirportId(f.getDestinationAirport().getId())
                        .destinationAirportCode(f.getDestinationAirport().getCode())
                        .destinationCity(f.getDestinationAirport().getCity())
                        .durationMinutes(f.getDurationMinutes())
                        .status(f.getStatus().name())
                        .createdAt(f.getCreatedAt())
                        .updatedAt(f.getUpdatedAt())
                        .build())
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Flights fetched", dtos));
    }

    @PostMapping("/flights")
    public ResponseEntity<ApiResponse<FlightResponseDto>> addFlight(
            @Valid @RequestBody FlightRequestDto request,
            HttpServletRequest httpRequest) {
        Long airportId = getAirportId(httpRequest);
        if (!request.getOriginAirportId().equals(airportId) && !request.getDestinationAirportId().equals(airportId)) {
            throw new BadRequestException(
                    "You can only create flights that depart from or arrive at your airport.");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Flight added successfully", flightService.addFlight(request)));
    }

    @PutMapping("/flights/{id}")
    public ResponseEntity<ApiResponse<FlightResponseDto>> updateFlight(
            @PathVariable Long id,
            @Valid @RequestBody FlightRequestDto request,
            HttpServletRequest httpRequest) {
        Long airportId = getAirportId(httpRequest);
        if (!request.getOriginAirportId().equals(airportId) && !request.getDestinationAirportId().equals(airportId)) {
            throw new BadRequestException(
                    "You can only update flights associated with your airport.");
        }
        return ResponseEntity.ok(ApiResponse.success("Flight updated", flightService.updateFlight(id, request)));
    }

    @PatchMapping("/flights/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateFlight(@PathVariable Long id, HttpServletRequest httpRequest) {
        Long airportId = getAirportId(httpRequest);
        Flight flight = flightDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));
        if (!flight.getOriginAirport().getId().equals(airportId) && !flight.getDestinationAirport().getId().equals(airportId)) {
            throw new BadRequestException("You can only manage flights at your airport.");
        }
        return ResponseEntity.ok(flightService.deactivateFlight(id));
    }

    @PatchMapping("/flights/{id}/reactivate")
    public ResponseEntity<ApiResponse<Void>> reactivateFlight(@PathVariable Long id, HttpServletRequest httpRequest) {
        Long airportId = getAirportId(httpRequest);
        Flight flight = flightDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));
        if (!flight.getOriginAirport().getId().equals(airportId) && !flight.getDestinationAirport().getId().equals(airportId)) {
            throw new BadRequestException("You can only manage flights at your airport.");
        }
        return ResponseEntity.ok(flightService.reactivateFlight(id));
    }

    private Long getAirportId(HttpServletRequest request) {
        Long airportId = (Long) request.getAttribute("airportId");
        if (airportId == null) {
            throw new BadRequestException("No airport assigned to this manager. Contact admin.");
        }
        return airportId;
    }
}
