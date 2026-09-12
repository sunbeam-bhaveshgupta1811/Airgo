package com.airline.reservation.service;

import com.airline.reservation.dto.ApiResponse;
import com.airline.reservation.entity.Airport;
import com.airline.reservation.dto.request.AirportRequestDto;
import com.airline.reservation.dto.response.AirportResponseDto;

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
