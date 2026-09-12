package com.airline.reservation.service;

import com.airline.reservation.dto.ApiResponse;
import com.airline.reservation.dto.request.AirlineRequestDto;
import com.airline.reservation.dto.response.AirlineResponseDto;

import java.util.List;

public interface AirlineService {
    AirlineResponseDto addAirline(AirlineRequestDto request);
    AirlineResponseDto updateAirline(Long id, AirlineRequestDto request);
    ApiResponse<Void> deactivateAirline(Long id);
    ApiResponse<Void> reactivateAirline(Long id);
    List<AirlineResponseDto> getAllAirlines();
    AirlineResponseDto getAirlineById(Long id);
    List<AirlineResponseDto> getActiveAirlines();
}
