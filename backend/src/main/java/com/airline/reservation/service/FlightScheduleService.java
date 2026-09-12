package com.airline.reservation.service;

import com.airline.reservation.dto.ApiResponse;
import com.airline.reservation.dto.request.FlightScheduleRequestDto;
import com.airline.reservation.dto.request.FlightSearchRequestDto;
import com.airline.reservation.dto.response.FlightScheduleResponseDto;

import java.util.List;

public interface FlightScheduleService {
    FlightScheduleResponseDto addSchedule(FlightScheduleRequestDto request);
    ApiResponse<Void> cancelSchedule(Long id);
    FlightScheduleResponseDto updateSchedule(Long id, FlightScheduleRequestDto request);
    FlightScheduleResponseDto updateScheduleStatus(Long id, String statusStr);
    List<FlightScheduleResponseDto> getAllSchedules();
    FlightScheduleResponseDto getScheduleById(Long id);
    List<FlightScheduleResponseDto> getSchedulesByFlight(Long flightId);
    List<FlightScheduleResponseDto> searchFlights(FlightSearchRequestDto request);
    com.airline.reservation.dto.response.RoundTripSearchResponseDto searchRoundTrip(FlightSearchRequestDto request);
}
