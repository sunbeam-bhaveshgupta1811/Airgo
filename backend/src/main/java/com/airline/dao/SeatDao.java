package com.airline.dao;

import com.airline.entity.Seat;
import com.airline.entity.SeatStatus;
import com.airline.entity.SeatClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatDao extends JpaRepository<Seat, Long> {

    List<Seat> findByFlightScheduleId(Long scheduleId);

    List<Seat> findByFlightScheduleIdAndStatus(Long scheduleId, SeatStatus status);

    List<Seat> findByFlightScheduleIdAndSeatClass(Long scheduleId, SeatClass seatClass);

    Optional<Seat> findByFlightScheduleIdAndSeatNumber(Long scheduleId, String seatNumber);

    List<Seat> findByBookingId(Long bookingId);

    boolean existsByFlightScheduleId(Long scheduleId);

    @Query("SELECT COUNT(s) FROM Seat s WHERE s.flightSchedule.id = :scheduleId AND s.status = :status")
    int countByScheduleIdAndStatus(@Param("scheduleId") Long scheduleId, @Param("status") SeatStatus status);
}
