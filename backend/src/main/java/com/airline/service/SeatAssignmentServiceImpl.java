package com.airline.service;


import com.airline.dao.PassengerDao;
import com.airline.entity.Booking;
import com.airline.entity.Passenger;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatAssignmentServiceImpl implements SeatAssignmentService {

    private final PassengerDao passengerDao;

    @Override
    public void assignSeats(Booking booking) {

        List<Passenger> passengers = passengerDao.findByBookingId(booking.getId());

        if (passengers.isEmpty()) {
            throw new RuntimeException("No passengers found for seat assignment");
        }

        int row = 1;
        char seatLetter = 'A';

        for (Passenger passenger : passengers) {

            String seatNumber = seatLetter + String.valueOf(row);
            passenger.setSeatNumber(seatNumber);

            seatLetter++;

            // after F → next row
            if (seatLetter > 'F') {
                seatLetter = 'A';
                row++;
            }
        }

        passengerDao.saveAll(passengers);
    }
}