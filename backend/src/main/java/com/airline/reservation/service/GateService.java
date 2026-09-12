package com.airline.reservation.service;

import com.airline.reservation.dto.ApiResponse;
import com.airline.reservation.dto.request.GateRequestDto;
import com.airline.reservation.dto.response.GateResponseDto;

import java.util.List;

public interface GateService {
    GateResponseDto addGate(GateRequestDto request);
    GateResponseDto updateGate(Long id, GateRequestDto request);
    ApiResponse<Void> deactivateGate(Long id);
    ApiResponse<Void> reactivateGate(Long id);
    List<GateResponseDto> getGatesByTerminal(Long terminalId);
    List<GateResponseDto> getGatesByAirport(Long airportId);
    GateResponseDto getGateById(Long id);
    List<GateResponseDto> getAllGates();
}
