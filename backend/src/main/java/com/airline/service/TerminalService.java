package com.airline.service;

import com.airline.dto.ApiResponse;
import com.airline.request.TerminalRequestDto;
import com.airline.response.TerminalResponseDto;

import java.util.List;

public interface TerminalService {
    TerminalResponseDto addTerminal(TerminalRequestDto request);
    TerminalResponseDto updateTerminal(Long id, TerminalRequestDto request);
    ApiResponse<Void> deactivateTerminal(Long id);
    ApiResponse<Void> reactivateTerminal(Long id);
    List<TerminalResponseDto> getTerminalsByAirport(Long airportId);
    TerminalResponseDto getTerminalById(Long id);
    List<TerminalResponseDto> getAllTerminals();
}
