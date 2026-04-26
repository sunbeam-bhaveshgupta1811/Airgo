package com.airline.service;

import com.airline.dto.ApiResponse;
import com.airline.entity.Booking;
import com.airline.response.SeatAssignmentResponse;
import com.airline.response.SeatMapResponse;

import java.util.List;

public interface SeatAssignmentService {
    void assignSeats(Booking booking);
    SeatAssignmentResponse assignSeatToPassenger(Long passengerId, String requestedSeat);
    ApiResponse<Void> reassignSeats(Long bookingId);
    SeatMapResponse getSeatMap(Long scheduleId);
    List<SeatAssignmentResponse> getSeatAssignmentsByBooking(Long bookingId);
    String getSeatZone(String seatNumber);
}