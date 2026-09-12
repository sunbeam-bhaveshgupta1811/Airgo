package com.airline.reservation.service;

import com.airline.reservation.repository.AirportRepository;
import com.airline.reservation.repository.TerminalRepository;
import com.airline.reservation.dto.ApiResponse;
import com.airline.reservation.entity.Airport;
import com.airline.reservation.entity.Terminal;
import com.airline.reservation.exception.BadRequestException;
import com.airline.reservation.exception.DuplicateResourceException;
import com.airline.reservation.exception.ResourceNotFoundException;
import com.airline.reservation.dto.request.TerminalRequestDto;
import com.airline.reservation.dto.response.TerminalResponseDto;
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
public class TerminalServiceImpl implements TerminalService {

    private final TerminalRepository terminalRepository;
    private final AirportRepository airportRepository;
    private final AccessGuard accessGuard;

    @Transactional
    public TerminalResponseDto addTerminal(TerminalRequestDto request) {
        // The controller only checks the caller's *role*. Without this scope check any
        // airport manager could create terminals at any airport in the system.
        accessGuard.requireAirportScope(request.getAirportId(), "terminals");

        Airport airport = airportRepository.findById(request.getAirportId())
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found with id: " + request.getAirportId()));

        if (terminalRepository.existsByAirportIdAndTerminalCode(request.getAirportId(), request.getTerminalCode().toUpperCase().trim())) {
            throw new DuplicateResourceException("Terminal already exists with code: " + request.getTerminalCode() + " at airport: " + airport.getCode());
        }

        Terminal terminal = Terminal.builder()
                .terminalCode(request.getTerminalCode().toUpperCase().trim())
                .name(request.getName().trim())
                .airport(airport)
                .active(true)
                .build();

        Terminal saved = terminalRepository.save(terminal);
        log.info("Terminal added: {} at airport {}", saved.getTerminalCode(), airport.getCode());
        return mapToResponse(saved);
    }

    @Transactional
    public TerminalResponseDto updateTerminal(Long id, TerminalRequestDto request) {
        Terminal terminal = findById(id);

        // Authorize against the terminal that actually exists, then against the airport the
        // caller is trying to move it to. Checking only the request body would let a manager
        // rewrite another airport's terminal by naming their own airport in the payload.
        accessGuard.requireAirportScope(terminal.getAirport().getId(), "terminals");
        accessGuard.requireAirportScope(request.getAirportId(), "terminals");

        Airport airport = airportRepository.findById(request.getAirportId())
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found with id: " + request.getAirportId()));

        if (terminalRepository.existsByAirportIdAndTerminalCodeAndIdNot(request.getAirportId(), request.getTerminalCode().toUpperCase().trim(), id)) {
            throw new DuplicateResourceException("Another terminal already exists with code: " + request.getTerminalCode());
        }

        terminal.setTerminalCode(request.getTerminalCode().toUpperCase().trim());
        terminal.setName(request.getName().trim());
        terminal.setAirport(airport);

        Terminal updated = terminalRepository.save(terminal);
        log.info("Terminal updated: {}", updated.getTerminalCode());
        return mapToResponse(updated);
    }

    @Transactional
    public ApiResponse<Void> deactivateTerminal(Long id) {
        Terminal terminal = findById(id);
        accessGuard.requireAirportScope(terminal.getAirport().getId(), "terminals");
        if (!terminal.isActive()) throw new BadRequestException("Terminal is already inactive");
        terminal.setActive(false);
        terminalRepository.save(terminal);
        return ApiResponse.success("Terminal deactivated successfully", null);
    }

    @Transactional
    public ApiResponse<Void> reactivateTerminal(Long id) {
        Terminal terminal = findById(id);
        accessGuard.requireAirportScope(terminal.getAirport().getId(), "terminals");
        if (terminal.isActive()) throw new BadRequestException("Terminal is already active");
        terminal.setActive(true);
        terminalRepository.save(terminal);
        return ApiResponse.success("Terminal reactivated successfully", null);
    }

    @Transactional(readOnly = true)
    public List<TerminalResponseDto> getTerminalsByAirport(Long airportId) {
        accessGuard.requireAirportScope(airportId, "terminals");
        return terminalRepository.findByAirportId(airportId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TerminalResponseDto getTerminalById(Long id) {
        Terminal terminal = findById(id);
        accessGuard.requireAirportScope(terminal.getAirport().getId(), "terminals");
        return mapToResponse(terminal);
    }

    @Transactional(readOnly = true)
    public List<TerminalResponseDto> getAllTerminals() {
        return terminalRepository.findAll().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    private Terminal findById(Long id) {
        return terminalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Terminal not found with id: " + id));
    }

    private TerminalResponseDto mapToResponse(Terminal t) {
        return TerminalResponseDto.builder()
                .id(t.getId())
                .terminalCode(t.getTerminalCode())
                .name(t.getName())
                .airportId(t.getAirport().getId())
                .airportCode(t.getAirport().getCode())
                .airportName(t.getAirport().getName())
                .active(t.isActive())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}
