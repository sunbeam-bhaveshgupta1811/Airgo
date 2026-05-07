package com.airline.service;

import com.airline.dto.ApiResponse;
import com.airline.request.AirlineRequestDto;
import com.airline.response.AirlineResponseDto;

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
