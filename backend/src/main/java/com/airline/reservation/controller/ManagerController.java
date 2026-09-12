package com.airline.reservation.controller;

import com.airline.reservation.repository.FlightRepository;
import com.airline.reservation.repository.FlightScheduleRepository;
import com.airline.reservation.repository.GateRepository;
import com.airline.reservation.repository.TerminalRepository;
import com.airline.reservation.dto.ApiResponse;
import com.airline.reservation.entity.Flight;
import com.airline.reservation.exception.ResourceNotFoundException;
import com.airline.reservation.dto.request.FlightRequestDto;
import com.airline.reservation.dto.response.*;
import com.airline.reservation.service.*;
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
    private final FlightScheduleService scheduleService;
    private final TerminalRepository terminalRepository;
    private final GateRepository gateRepository;
    private final FlightRepository flightRepository;
    private final FlightScheduleRepository scheduleRepository;
    private final com.airline.reservation.repository.BookingRepository bookingRepository;
    private final com.airline.reservation.repository.PassengerRepository passengerRepository;
    private final com.airline.reservation.security.AccessGuard accessGuard;

    @GetMapping("/my-airport")
    public ResponseEntity<ApiResponse<AirportResponseDto>> getMyAirport(HttpServletRequest request) {
        Long airportId = getAirportIdOrNull(request);
        if (airportId == null) {
            return ResponseEntity.ok(ApiResponse.success("No airport assigned", null));
        }
        return ResponseEntity.ok(ApiResponse.success("Airport fetched", airportService.getAirportById(airportId)));
    }

    @GetMapping("/terminals")
    public ResponseEntity<ApiResponse<List<TerminalResponseDto>>> getMyTerminals(HttpServletRequest request) {
        Long airportId = getAirportIdOrNull(request);
        if (airportId == null) {
            return ResponseEntity.ok(ApiResponse.success("No airport assigned", List.of()));
        }
        return ResponseEntity.ok(ApiResponse.success("Terminals fetched", terminalService.getTerminalsByAirport(airportId)));
    }

    @GetMapping("/gates")
    public ResponseEntity<ApiResponse<List<GateResponseDto>>> getMyGates(HttpServletRequest request) {
        Long airportId = getAirportIdOrNull(request);
        if (airportId == null) {
            return ResponseEntity.ok(ApiResponse.success("No airport assigned", List.of()));
        }
        return ResponseEntity.ok(ApiResponse.success("Gates fetched", gateService.getGatesByAirport(airportId)));
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats(HttpServletRequest request) {
        Long airportId = getAirportIdOrNull(request);
        if (airportId == null) {
            Map<String, Object> empty = new LinkedHashMap<>();
            empty.put("terminalCount", 0);
            empty.put("gateCount", 0);
            empty.put("airportInfo", null);
            empty.put("noAirport", true);
            return ResponseEntity.ok(ApiResponse.success("No airport assigned", empty));
        }
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("terminalCount", terminalRepository.findByAirportId(airportId).size());
        stats.put("gateCount", gateRepository.findByAirportId(airportId).size());
        stats.put("airportInfo", airportService.getAirportById(airportId));
        return ResponseEntity.ok(ApiResponse.success("Manager dashboard stats", stats));
    }

    // ===== AIRLINE MANAGEMENT (view-only, Admin manages airlines) =====

    @GetMapping("/airlines")
    public ResponseEntity<ApiResponse<List<AirlineResponseDto>>> getAirlines() {
        return ResponseEntity.ok(ApiResponse.success("Airlines fetched", airlineService.getAllAirlines()));
    }

    // ===== FLIGHT MANAGEMENT (scoped to manager's airport) =====

    @GetMapping("/flights")
    public ResponseEntity<ApiResponse<List<FlightResponseDto>>> getMyFlights(HttpServletRequest request) {
        Long airportId = getAirportIdOrNull(request);
        if (airportId == null) {
            return ResponseEntity.ok(ApiResponse.success("No airport assigned", List.of()));
        }
        List<Flight> flights = flightRepository.findByAirportId(airportId);
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
        // On create there is no existing row, so the requested route is the right thing
        // to authorize against.
        accessGuard.requireFlightScope(
                request.getOriginAirportId(), request.getDestinationAirportId(), "create");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Flight added successfully", flightService.addFlight(request)));
    }

    @PutMapping("/flights/{id}")
    public ResponseEntity<ApiResponse<FlightResponseDto>> updateFlight(
            @PathVariable Long id,
            @Valid @RequestBody FlightRequestDto request,
            HttpServletRequest httpRequest) {
        Flight existing = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));

        // Authorize against the flight that actually exists. The previous version checked
        // the request body instead, so a manager could rewrite any airport's flight simply
        // by naming their own airport in the payload.
        accessGuard.requireFlightScope(
                existing.getOriginAirport().getId(), existing.getDestinationAirport().getId(), "update");

        // Then confirm the new route stays in scope, so a flight cannot be moved away.
        accessGuard.requireFlightScope(
                request.getOriginAirportId(), request.getDestinationAirportId(), "update");

        return ResponseEntity.ok(ApiResponse.success("Flight updated", flightService.updateFlight(id, request)));
    }

    @PatchMapping("/flights/{id}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateFlight(@PathVariable Long id, HttpServletRequest httpRequest) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));
        accessGuard.requireFlightScope(
                flight.getOriginAirport().getId(), flight.getDestinationAirport().getId(), "manage");
        return ResponseEntity.ok(flightService.deactivateFlight(id));
    }

    @PatchMapping("/flights/{id}/reactivate")
    public ResponseEntity<ApiResponse<Void>> reactivateFlight(@PathVariable Long id, HttpServletRequest httpRequest) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));
        accessGuard.requireFlightScope(
                flight.getOriginAirport().getId(), flight.getDestinationAirport().getId(), "manage");
        return ResponseEntity.ok(flightService.reactivateFlight(id));
    }

    // ===== SCHEDULE MANAGEMENT (scoped to manager's airport) =====

    @GetMapping("/schedules")
    public ResponseEntity<ApiResponse<List<com.airline.reservation.dto.response.FlightScheduleResponseDto>>> getMySchedules(HttpServletRequest request) {
        Long airportId = getAirportIdOrNull(request);
        if (airportId == null) {
            return ResponseEntity.ok(ApiResponse.success("No airport assigned", List.of()));
        }
        List<com.airline.reservation.dto.response.FlightScheduleResponseDto> all = scheduleService.getAllSchedules();
        List<com.airline.reservation.dto.response.FlightScheduleResponseDto> filtered = all.stream()
                .filter(s -> {
                    Flight flight = flightRepository.findById(s.getFlightId()).orElse(null);
                    if (flight == null) return false;
                    return flight.getOriginAirport().getId().equals(airportId)
                            || flight.getDestinationAirport().getId().equals(airportId);
                })
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Schedules fetched", filtered));
    }

    @PostMapping("/schedules")
    public ResponseEntity<ApiResponse<com.airline.reservation.dto.response.FlightScheduleResponseDto>> addSchedule(
            @Valid @RequestBody com.airline.reservation.dto.request.FlightScheduleRequestDto request,
            HttpServletRequest httpRequest) {
        Flight flight = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));
        accessGuard.requireFlightScope(
                flight.getOriginAirport().getId(), flight.getDestinationAirport().getId(), "schedule");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Schedule added", scheduleService.addSchedule(request)));
    }

    @PutMapping("/schedules/{id}")
    public ResponseEntity<ApiResponse<com.airline.reservation.dto.response.FlightScheduleResponseDto>> updateSchedule(
            @PathVariable Long id,
            @Valid @RequestBody com.airline.reservation.dto.request.FlightScheduleRequestDto request,
            HttpServletRequest httpRequest) {
        com.airline.reservation.entity.FlightSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));

        // Authorize against the schedule being updated, not the flight named in the request —
        // otherwise a manager could edit any airport's schedule by pointing the payload at
        // one of their own flights.
        Flight current = schedule.getFlight();
        accessGuard.requireFlightScope(
                current.getOriginAirport().getId(), current.getDestinationAirport().getId(), "update");

        // The flight it is being reassigned to must also be in scope.
        Flight target = flightRepository.findById(request.getFlightId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));
        accessGuard.requireFlightScope(
                target.getOriginAirport().getId(), target.getDestinationAirport().getId(), "update");

        return ResponseEntity.ok(ApiResponse.success("Schedule updated", scheduleService.updateSchedule(id, request)));
    }

    @PatchMapping("/schedules/{id}/status")
    public ResponseEntity<ApiResponse<com.airline.reservation.dto.response.FlightScheduleResponseDto>> updateScheduleStatus(
            @PathVariable Long id,
            @RequestParam String status,
            HttpServletRequest httpRequest) {
        com.airline.reservation.entity.FlightSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));
        Flight flight = schedule.getFlight();
        accessGuard.requireFlightScope(
                flight.getOriginAirport().getId(), flight.getDestinationAirport().getId(), "manage");
        return ResponseEntity.ok(ApiResponse.success("Status updated", scheduleService.updateScheduleStatus(id, status)));
    }

    @PatchMapping("/schedules/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelSchedule(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        com.airline.reservation.entity.FlightSchedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));
        Flight flight = schedule.getFlight();
        accessGuard.requireFlightScope(
                flight.getOriginAirport().getId(), flight.getDestinationAirport().getId(), "cancel");
        return ResponseEntity.ok(scheduleService.cancelSchedule(id));
    }

    // ===== PASSENGER MANAGEMENT (scoped to manager's airport) =====

    @GetMapping("/passengers")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyPassengers(HttpServletRequest request) {
        Long airportId = getAirportIdOrNull(request);
        if (airportId == null) {
            return ResponseEntity.ok(ApiResponse.success("No airport assigned", List.of()));
        }
        List<com.airline.reservation.entity.Booking> bookings = bookingRepository.findByAirportIdWithDetails(airportId);
        List<Map<String, Object>> passengers = new java.util.ArrayList<>();

        for (com.airline.reservation.entity.Booking booking : bookings) {
            for (com.airline.reservation.entity.Passenger p : booking.getPassengers()) {
                Map<String, Object> pm = new java.util.LinkedHashMap<>();
                pm.put("id", p.getId());
                pm.put("firstName", p.getFirstName());
                pm.put("lastName", p.getLastName());
                pm.put("gender", p.getGender().name());
                pm.put("seatNumber", p.getSeatNumber());
                pm.put("bookingReference", booking.getBookingReference());
                pm.put("flightNumber", booking.getFlightSchedule().getFlight().getFlightNumber());
                pm.put("route", booking.getFlightSchedule().getFlight().getOriginAirport().getCode()
                        + " → " + booking.getFlightSchedule().getFlight().getDestinationAirport().getCode());
                pm.put("journeyDate", booking.getFlightSchedule().getJourneyDate());
                pm.put("bookingStatus", booking.getStatus().name());
                passengers.add(pm);
            }
        }

        return ResponseEntity.ok(ApiResponse.success("Passengers fetched", passengers));
    }

    /**
     * Returns the manager's airport, or null when none is assigned. Read-only endpoints use
     * this to render an empty dashboard rather than an error.
     *
     * Write paths no longer have a local counterpart — they go through AccessGuard, which
     * authorizes against the target entity instead of a caller-supplied airport id.
     */
    private Long getAirportIdOrNull(HttpServletRequest request) {
        return (Long) request.getAttribute("airportId");
    }
}
