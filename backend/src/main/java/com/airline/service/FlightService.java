package com.airline.service;

import com.airline.dto.ApiResponse;
import com.airline.request.FlightRequestDto;
import com.airline.response.FlightResponseDto;

import java.util.List;

public interface FlightService {
    FlightResponseDto addFlight(FlightRequestDto request);
    FlightResponseDto updateFlight(Long id, FlightRequestDto request);
    ApiResponse<Void> deactivateFlight(Long id);
    ApiResponse<Void> reactivateFlight(Long id);
    List<FlightResponseDto> getAllFlights();
    List<FlightResponseDto> getActiveFlights();
    FlightResponseDto getFlightById(Long id);
    List<FlightResponseDto> getFlightsByAirline(Long airlineId);
}