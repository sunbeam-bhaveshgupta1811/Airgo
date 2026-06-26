package com.airline.service;

import com.airline.dao.GateDao;
import com.airline.dao.TerminalDao;
import com.airline.dto.ApiResponse;
import com.airline.entity.Gate;
import com.airline.entity.GateStatus;
import com.airline.entity.Terminal;
import com.airline.exception.BadRequestException;
import com.airline.exception.DuplicateResourceException;
import com.airline.exception.ResourceNotFoundException;
import com.airline.request.GateRequestDto;
import com.airline.response.GateResponseDto;
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

    private final GateDao gateDao;
    private final TerminalDao terminalDao;

    @Transactional
    public GateResponseDto addGate(GateRequestDto request) {
        Terminal terminal = terminalDao.findById(request.getTerminalId())
                .orElseThrow(() -> new ResourceNotFoundException("Terminal not found with id: " + request.getTerminalId()));

        if (gateDao.existsByTerminalIdAndGateNumber(request.getTerminalId(), request.getGateNumber().toUpperCase().trim())) {
            throw new DuplicateResourceException("Gate already exists with number: " + request.getGateNumber() + " at terminal: " + terminal.getTerminalCode());
        }

        Gate gate = Gate.builder()
                .gateNumber(request.getGateNumber().toUpperCase().trim())
                .terminal(terminal)
                .status(GateStatus.AVAILABLE)
                .active(true)
                .build();

        Gate saved = gateDao.save(gate);
        log.info("Gate added: {} at terminal {}", saved.getGateNumber(), terminal.getTerminalCode());
        return mapToResponse(saved);
    }

    @Transactional
    public GateResponseDto updateGate(Long id, GateRequestDto request) {
        Gate gate = findById(id);
        Terminal terminal = terminalDao.findById(request.getTerminalId())
                .orElseThrow(() -> new ResourceNotFoundException("Terminal not found with id: " + request.getTerminalId()));

        if (gateDao.existsByTerminalIdAndGateNumberAndIdNot(request.getTerminalId(), request.getGateNumber().toUpperCase().trim(), id)) {
            throw new DuplicateResourceException("Another gate already exists with number: " + request.getGateNumber());
        }

        gate.setGateNumber(request.getGateNumber().toUpperCase().trim());
        gate.setTerminal(terminal);
        if (request.getStatus() != null) {
            gate.setStatus(GateStatus.valueOf(request.getStatus().toUpperCase()));
        }

        Gate updated = gateDao.save(gate);
        log.info("Gate updated: {}", updated.getGateNumber());
        return mapToResponse(updated);
    }

    @Transactional
    public ApiResponse<Void> deactivateGate(Long id) {
        Gate gate = findById(id);
        if (!gate.isActive()) throw new BadRequestException("Gate is already inactive");
        gate.setActive(false);
        gateDao.save(gate);
        return ApiResponse.success("Gate deactivated successfully", null);
    }

    @Transactional
    public ApiResponse<Void> reactivateGate(Long id) {
        Gate gate = findById(id);
        if (gate.isActive()) throw new BadRequestException("Gate is already active");
        gate.setActive(true);
        gateDao.save(gate);
        return ApiResponse.success("Gate reactivated successfully", null);
    }

    @Transactional(readOnly = true)
    public List<GateResponseDto> getGatesByTerminal(Long terminalId) {
        return gateDao.findByTerminalId(terminalId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GateResponseDto> getGatesByAirport(Long airportId) {
        return gateDao.findByAirportId(airportId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GateResponseDto getGateById(Long id) {
        return mapToResponse(findById(id));
    }

    @Transactional(readOnly = true)
    public List<GateResponseDto> getAllGates() {
        return gateDao.findAll().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    private Gate findById(Long id) {
        return gateDao.findById(id)
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
