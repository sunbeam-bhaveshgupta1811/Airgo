package com.airline.service;

import com.airline.dto.ApiResponse;
import com.airline.request.FlightScheduleRequestDto;
import com.airline.response.FlightScheduleResponseDto;

import java.util.List;

public interface FlightScheduleService {
    FlightScheduleResponseDto addSchedule(FlightScheduleRequestDto request);
    ApiResponse<Void> cancelSchedule(Long id);
    FlightScheduleResponseDto updateSchedule(Long id, FlightScheduleRequestDto request);
    FlightScheduleResponseDto updateScheduleStatus(Long id, String statusStr);
    List<FlightScheduleResponseDto> getAllSchedules();
    FlightScheduleResponseDto getScheduleById(Long id);
    List<FlightScheduleResponseDto> getSchedulesByFlight(Long flightId);
}
