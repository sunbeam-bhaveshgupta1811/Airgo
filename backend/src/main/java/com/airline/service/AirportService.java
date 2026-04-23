package com.airline.service;

import com.airline.dto.ApiResponse;
import com.airline.entity.Airport;
import com.airline.request.AirportRequestDto;
import com.airline.response.AirportResponseDto;

import java.util.List;

public interface AirportService {
    AirportResponseDto addAirport(AirportRequestDto request);
    AirportResponseDto updateAirport(Long id, AirportRequestDto request);
    ApiResponse<Void> deactivateAirport(Long id);
    ApiResponse<Void> reactivateAirport(Long id);
    List<AirportResponseDto> getAllAirports();
    List<AirportResponseDto> getActiveAirports();
    AirportResponseDto getAirportById(Long id);
    Airport findByCode(String code);
}
