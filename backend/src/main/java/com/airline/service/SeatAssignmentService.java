package com.airline.service;

import com.airline.entity.Booking;

public interface SeatAssignmentService {
    void assignSeats(Booking booking);
}