package com.airline.controller;

import com.airline.dao.GateDao;
import com.airline.dao.TerminalDao;
import com.airline.dto.ApiResponse;
import com.airline.response.*;
import com.airline.service.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
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
    private final TerminalDao terminalDao;
    private final GateDao gateDao;

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

    private Long getAirportId(HttpServletRequest request) {
        Long airportId = (Long) request.getAttribute("airportId");
        if (airportId == null) {
            throw new com.airline.exception.BadRequestException("No airport assigned to this manager. Contact admin.");
        }
        return airportId;
    }
}
