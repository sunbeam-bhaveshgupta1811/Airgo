package com.airline.reservation.service;

import com.airline.reservation.dto.ApiResponse;
import com.airline.reservation.entity.Booking;
import com.airline.reservation.dto.response.SeatAssignmentResponse;
import com.airline.reservation.dto.response.SeatMapResponse;

import java.util.List;

public interface SeatAssignmentService {
    void assignSeats(Booking booking);
    SeatAssignmentResponse assignSeatToPassenger(Long passengerId, String requestedSeat);
    ApiResponse<Void> reassignSeats(Long bookingId);
    SeatMapResponse getSeatMap(Long scheduleId);
    List<SeatAssignmentResponse> getSeatAssignmentsByBooking(Long bookingId);
    String getSeatZone(String seatNumber);
}