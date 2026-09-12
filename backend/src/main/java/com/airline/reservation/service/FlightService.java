package com.airline.reservation.service;

import com.airline.reservation.dto.ApiResponse;
import com.airline.reservation.dto.request.FlightRequestDto;
import com.airline.reservation.dto.response.FlightResponseDto;

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