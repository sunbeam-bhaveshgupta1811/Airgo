package com.airline.service;

import com.airline.dao.AirportDao;
import com.airline.dao.TerminalDao;
import com.airline.dto.ApiResponse;
import com.airline.entity.Airport;
import com.airline.entity.Terminal;
import com.airline.exception.BadRequestException;
import com.airline.exception.DuplicateResourceException;
import com.airline.exception.ResourceNotFoundException;
import com.airline.request.TerminalRequestDto;
import com.airline.response.TerminalResponseDto;
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

    private final TerminalDao terminalDao;
    private final AirportDao airportDao;

    @Transactional
    public TerminalResponseDto addTerminal(TerminalRequestDto request) {
        Airport airport = airportDao.findById(request.getAirportId())
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found with id: " + request.getAirportId()));

        if (terminalDao.existsByAirportIdAndTerminalCode(request.getAirportId(), request.getTerminalCode().toUpperCase().trim())) {
            throw new DuplicateResourceException("Terminal already exists with code: " + request.getTerminalCode() + " at airport: " + airport.getCode());
        }

        Terminal terminal = Terminal.builder()
                .terminalCode(request.getTerminalCode().toUpperCase().trim())
                .name(request.getName().trim())
                .airport(airport)
                .active(true)
                .build();

        Terminal saved = terminalDao.save(terminal);
        log.info("Terminal added: {} at airport {}", saved.getTerminalCode(), airport.getCode());
        return mapToResponse(saved);
    }

    @Transactional
    public TerminalResponseDto updateTerminal(Long id, TerminalRequestDto request) {
        Terminal terminal = findById(id);
        Airport airport = airportDao.findById(request.getAirportId())
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found with id: " + request.getAirportId()));

        if (terminalDao.existsByAirportIdAndTerminalCodeAndIdNot(request.getAirportId(), request.getTerminalCode().toUpperCase().trim(), id)) {
            throw new DuplicateResourceException("Another terminal already exists with code: " + request.getTerminalCode());
        }

        terminal.setTerminalCode(request.getTerminalCode().toUpperCase().trim());
        terminal.setName(request.getName().trim());
        terminal.setAirport(airport);

        Terminal updated = terminalDao.save(terminal);
        log.info("Terminal updated: {}", updated.getTerminalCode());
        return mapToResponse(updated);
    }

    @Transactional
    public ApiResponse<Void> deactivateTerminal(Long id) {
        Terminal terminal = findById(id);
        if (!terminal.isActive()) throw new BadRequestException("Terminal is already inactive");
        terminal.setActive(false);
        terminalDao.save(terminal);
        return ApiResponse.success("Terminal deactivated successfully", null);
    }

    @Transactional
    public ApiResponse<Void> reactivateTerminal(Long id) {
        Terminal terminal = findById(id);
        if (terminal.isActive()) throw new BadRequestException("Terminal is already active");
        terminal.setActive(true);
        terminalDao.save(terminal);
        return ApiResponse.success("Terminal reactivated successfully", null);
    }

    @Transactional(readOnly = true)
    public List<TerminalResponseDto> getTerminalsByAirport(Long airportId) {
        return terminalDao.findByAirportId(airportId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TerminalResponseDto getTerminalById(Long id) {
        return mapToResponse(findById(id));
    }

    @Transactional(readOnly = true)
    public List<TerminalResponseDto> getAllTerminals() {
        return terminalDao.findAll().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    private Terminal findById(Long id) {
        return terminalDao.findById(id)
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
