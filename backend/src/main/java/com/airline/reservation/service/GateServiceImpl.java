package com.airline.reservation.service;

import com.airline.reservation.repository.GateRepository;
import com.airline.reservation.repository.TerminalRepository;
import com.airline.reservation.dto.ApiResponse;
import com.airline.reservation.entity.Gate;
import com.airline.reservation.entity.GateStatus;
import com.airline.reservation.entity.Terminal;
import com.airline.reservation.exception.BadRequestException;
import com.airline.reservation.exception.DuplicateResourceException;
import com.airline.reservation.exception.ResourceNotFoundException;
import com.airline.reservation.dto.request.GateRequestDto;
import com.airline.reservation.dto.response.GateResponseDto;
import com.airline.reservation.security.AccessGuard;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GateServiceImpl implements GateService {

    private final GateRepository gateRepository;
    private final TerminalRepository terminalRepository;
    private final AccessGuard accessGuard;

    @Transactional
    public GateResponseDto addGate(GateRequestDto request) {
        Terminal terminal = terminalRepository.findById(request.getTerminalId())
                .orElseThrow(() -> new ResourceNotFoundException("Terminal not found with id: " + request.getTerminalId()));

        // A gate's airport is its terminal's airport — resolve it from the loaded terminal
        // rather than trusting anything in the request body.
        accessGuard.requireAirportScope(terminal.getAirport().getId(), "gates");

        if (gateRepository.existsByTerminalIdAndGateNumber(request.getTerminalId(), request.getGateNumber().toUpperCase().trim())) {
            throw new DuplicateResourceException("Gate already exists with number: " + request.getGateNumber() + " at terminal: " + terminal.getTerminalCode());
        }

        Gate gate = Gate.builder()
                .gateNumber(request.getGateNumber().toUpperCase().trim())
                .terminal(terminal)
                .status(GateStatus.AVAILABLE)
                .active(true)
                .build();

        Gate saved = gateRepository.save(gate);
        log.info("Gate added: {} at terminal {}", saved.getGateNumber(), terminal.getTerminalCode());
        return mapToResponse(saved);
    }

    @Transactional
    public GateResponseDto updateGate(Long id, GateRequestDto request) {
        Gate gate = findById(id);
        accessGuard.requireAirportScope(gate.getTerminal().getAirport().getId(), "gates");

        Terminal terminal = terminalRepository.findById(request.getTerminalId())
                .orElseThrow(() -> new ResourceNotFoundException("Terminal not found with id: " + request.getTerminalId()));

        // Also scope the destination terminal, so a gate cannot be moved across airports.
        accessGuard.requireAirportScope(terminal.getAirport().getId(), "gates");

        if (gateRepository.existsByTerminalIdAndGateNumberAndIdNot(request.getTerminalId(), request.getGateNumber().toUpperCase().trim(), id)) {
            throw new DuplicateResourceException("Another gate already exists with number: " + request.getGateNumber());
        }

        gate.setGateNumber(request.getGateNumber().toUpperCase().trim());
        gate.setTerminal(terminal);
        if (request.getStatus() != null) {
            gate.setStatus(GateStatus.valueOf(request.getStatus().toUpperCase()));
        }

        Gate updated = gateRepository.save(gate);
        log.info("Gate updated: {}", updated.getGateNumber());
        return mapToResponse(updated);
    }

    @Transactional
    public ApiResponse<Void> deactivateGate(Long id) {
        Gate gate = findById(id);
        accessGuard.requireAirportScope(gate.getTerminal().getAirport().getId(), "gates");
        if (!gate.isActive()) throw new BadRequestException("Gate is already inactive");
        gate.setActive(false);
        gateRepository.save(gate);
        return ApiResponse.success("Gate deactivated successfully", null);
    }

    @Transactional
    public ApiResponse<Void> reactivateGate(Long id) {
        Gate gate = findById(id);
        accessGuard.requireAirportScope(gate.getTerminal().getAirport().getId(), "gates");
        if (gate.isActive()) throw new BadRequestException("Gate is already active");
        gate.setActive(true);
        gateRepository.save(gate);
        return ApiResponse.success("Gate reactivated successfully", null);
    }

    @Transactional(readOnly = true)
    public List<GateResponseDto> getGatesByTerminal(Long terminalId) {
        Terminal terminal = terminalRepository.findById(terminalId)
                .orElseThrow(() -> new ResourceNotFoundException("Terminal not found with id: " + terminalId));
        accessGuard.requireAirportScope(terminal.getAirport().getId(), "gates");
        return gateRepository.findByTerminalId(terminalId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GateResponseDto> getGatesByAirport(Long airportId) {
        accessGuard.requireAirportScope(airportId, "gates");
        return gateRepository.findByAirportId(airportId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GateResponseDto getGateById(Long id) {
        Gate gate = findById(id);
        accessGuard.requireAirportScope(gate.getTerminal().getAirport().getId(), "gates");
        return mapToResponse(gate);
    }

    @Transactional(readOnly = true)
    public List<GateResponseDto> getAllGates() {
        return gateRepository.findAll().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    private Gate findById(Long id) {
        return gateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gate not found with id: " + id));
    }

    private GateResponseDto mapToResponse(Gate g) {
        Terminal t = g.getTerminal();
        return GateResponseDto.builder()
                .id(g.getId())
                .gateNumber(g.getGateNumber())
                .terminalId(t.getId())
                .terminalCode(t.getTerminalCode())
                .terminalName(t.getName())
                .airportId(t.getAirport().getId())
                .airportCode(t.getAirport().getCode())
                .status(g.getStatus().name())
                .active(g.isActive())
                .createdAt(g.getCreatedAt())
                .updatedAt(g.getUpdatedAt())
                .build();
    }
}
