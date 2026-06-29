package com.airline.controller;

import com.airline.dao.FlightDao;
import com.airline.dao.FlightScheduleDao;
import com.airline.dao.GateDao;
import com.airline.dao.TerminalDao;
import com.airline.dto.ApiResponse;
import com.airline.entity.Flight;
import com.airline.exception.BadRequestException;
import com.airline.exception.ResourceNotFoundException;
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
    private final FlightScheduleService scheduleService;
    private final TerminalDao terminalDao;
    private final GateDao gateDao;
    private final FlightDao flightDao;
    private final FlightScheduleDao scheduleDao;
    private final com.airline.dao.BookingDao bookingDao;
    private final com.airline.dao.PassengerDao passengerDao;

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
        stats.put("terminalCount", terminalDao.findByAirportId(airportId).size());
        stats.put("gateCount", gateDao.findByAirportId(airportId).size());
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

    // ===== SCHEDULE MANAGEMENT (scoped to manager's airport) =====

    @GetMapping("/schedules")
    public ResponseEntity<ApiResponse<List<com.airline.response.FlightScheduleResponseDto>>> getMySchedules(HttpServletRequest request) {
        Long airportId = getAirportIdOrNull(request);
        if (airportId == null) {
            return ResponseEntity.ok(ApiResponse.success("No airport assigned", List.of()));
        }
        List<com.airline.response.FlightScheduleResponseDto> all = scheduleService.getAllSchedules();
        List<com.airline.response.FlightScheduleResponseDto> filtered = all.stream()
                .filter(s -> {
                    Flight flight = flightDao.findById(s.getFlightId()).orElse(null);
                    if (flight == null) return false;
                    return flight.getOriginAirport().getId().equals(airportId)
                            || flight.getDestinationAirport().getId().equals(airportId);
                })
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Schedules fetched", filtered));
    }

    @PostMapping("/schedules")
    public ResponseEntity<ApiResponse<com.airline.response.FlightScheduleResponseDto>> addSchedule(
            @Valid @RequestBody com.airline.request.FlightScheduleRequestDto request,
            HttpServletRequest httpRequest) {
        Long airportId = getAirportId(httpRequest);
        Flight flight = flightDao.findById(request.getFlightId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));
        if (!flight.getOriginAirport().getId().equals(airportId) && !flight.getDestinationAirport().getId().equals(airportId)) {
            throw new BadRequestException("You can only schedule flights at your airport.");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Schedule added", scheduleService.addSchedule(request)));
    }

    @PutMapping("/schedules/{id}")
    public ResponseEntity<ApiResponse<com.airline.response.FlightScheduleResponseDto>> updateSchedule(
            @PathVariable Long id,
            @Valid @RequestBody com.airline.request.FlightScheduleRequestDto request,
            HttpServletRequest httpRequest) {
        Long airportId = getAirportId(httpRequest);
        Flight flight = flightDao.findById(request.getFlightId())
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found"));
        if (!flight.getOriginAirport().getId().equals(airportId) && !flight.getDestinationAirport().getId().equals(airportId)) {
            throw new BadRequestException("You can only update schedules at your airport.");
        }
        return ResponseEntity.ok(ApiResponse.success("Schedule updated", scheduleService.updateSchedule(id, request)));
    }

    @PatchMapping("/schedules/{id}/status")
    public ResponseEntity<ApiResponse<com.airline.response.FlightScheduleResponseDto>> updateScheduleStatus(
            @PathVariable Long id,
            @RequestParam String status,
            HttpServletRequest httpRequest) {
        Long airportId = getAirportId(httpRequest);
        com.airline.entity.FlightSchedule schedule = scheduleDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));
        Flight flight = schedule.getFlight();
        if (!flight.getOriginAirport().getId().equals(airportId) && !flight.getDestinationAirport().getId().equals(airportId)) {
            throw new BadRequestException("You can only manage schedules at your airport.");
        }
        return ResponseEntity.ok(ApiResponse.success("Status updated", scheduleService.updateScheduleStatus(id, status)));
    }

    @PatchMapping("/schedules/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelSchedule(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        Long airportId = getAirportId(httpRequest);
        com.airline.entity.FlightSchedule schedule = scheduleDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));
        Flight flight = schedule.getFlight();
        if (!flight.getOriginAirport().getId().equals(airportId) && !flight.getDestinationAirport().getId().equals(airportId)) {
            throw new BadRequestException("You can only cancel schedules at your airport.");
        }
        return ResponseEntity.ok(scheduleService.cancelSchedule(id));
    }

    // ===== PASSENGER MANAGEMENT (scoped to manager's airport) =====

    @GetMapping("/passengers")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyPassengers(HttpServletRequest request) {
        Long airportId = getAirportIdOrNull(request);
        if (airportId == null) {
            return ResponseEntity.ok(ApiResponse.success("No airport assigned", List.of()));
        }
        List<com.airline.entity.Booking> bookings = bookingDao.findByAirportIdWithDetails(airportId);
        List<Map<String, Object>> passengers = new java.util.ArrayList<>();

        for (com.airline.entity.Booking booking : bookings) {
            for (com.airline.entity.Passenger p : booking.getPassengers()) {
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
     * Returns airportId or null. Use getAirportIdRequired() for endpoints that MUST have an airport.
     */
    private Long getAirportIdOrNull(HttpServletRequest request) {
        return (Long) request.getAttribute("airportId");
    }

    /**
     * Returns airportId or throws 400 for write operations that require an airport.
     */
    private Long getAirportId(HttpServletRequest request) {
        Long airportId = (Long) request.getAttribute("airportId");
        if (airportId == null) {
            throw new BadRequestException("No airport assigned to this manager. Please contact the administrator to assign you an airport.");
        }
        return airportId;
    }
}
