package com.airline.reservation.service;

import com.airline.reservation.dto.response.PassengerResponseDto;

import java.util.List;

public interface PassengerService {
    List<PassengerResponseDto> getPassengersByBooking(Long bookingId);
    PassengerResponseDto getPassengerById(Long passengerId);
    List<PassengerResponseDto> getAllPassengersForSchedule(Long scheduleId);
    List<PassengerResponseDto> getAllPassengers();
}
