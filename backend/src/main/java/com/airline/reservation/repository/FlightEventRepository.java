package com.airline.reservation.repository;

import com.airline.reservation.entity.FlightEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightEventRepository extends JpaRepository<FlightEvent, Long> {
    List<FlightEvent> findByFlightScheduleIdOrderByCreatedAtDesc(Long scheduleId);
}
