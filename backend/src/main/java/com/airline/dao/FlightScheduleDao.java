package com.airline.dao;

import com.airline.entity.FlightSchedule;
import com.airline.entity.ScheduleStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlightScheduleDao extends JpaRepository<FlightSchedule, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT fs FROM FlightSchedule fs WHERE fs.id = :id")
    Optional<FlightSchedule> findByIdWithLock(@Param("id") Long id);

    List<FlightSchedule> findByFlightId(Long flightId);

    List<FlightSchedule> findByJourneyDate(LocalDate journeyDate);

    List<FlightSchedule> findByFlightIdAndJourneyDate(Long flightId, LocalDate journeyDate);

    boolean existsByFlightIdAndJourneyDateAndDepartureTime(
            Long flightId,
            LocalDate journeyDate,
            java.time.LocalTime departureTime);

    @Query("""
            SELECT fs FROM FlightSchedule fs
            JOIN fs.flight f
            WHERE f.originAirport.id = :originId
            AND f.destinationAirport.id = :destinationId
            AND fs.journeyDate = :journeyDate
            AND fs.status = 'SCHEDULED'
            AND fs.availableSeats >= :passengers
            ORDER BY fs.departureTime ASC
            """)
    List<FlightSchedule> searchSchedules(
            @Param("originId") Long originId,
            @Param("destinationId") Long destinationId,
            @Param("journeyDate") LocalDate journeyDate,
            @Param("passengers") int passengers);

    List<FlightSchedule> findByStatus(ScheduleStatus status);
}