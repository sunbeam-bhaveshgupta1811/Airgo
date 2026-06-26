package com.airline.dao;

import com.airline.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PassengerDao extends JpaRepository<Passenger, Long> {

    List<Passenger> findByBookingId(Long bookingId);

    int countByBookingId(Long bookingId);

    @Query(" SELECT p.seatNumber FROM Passenger p WHERE p.booking.flightSchedule.id = :scheduleId AND p.seatNumber IS NOT NULL AND p.booking.status != 'CANCELLED'")
    List<String> findOccupiedSeatsByScheduleId(@Param("scheduleId") Long scheduleId);

    @Query("SELECT p FROM Passenger p JOIN FETCH p.booking b WHERE b.flightSchedule.id = :scheduleId AND b.status != 'CANCELLED'")
    List<Passenger> findByScheduleId(@Param("scheduleId") Long scheduleId);
}