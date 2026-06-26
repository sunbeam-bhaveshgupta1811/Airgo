package com.airline.dao;

import com.airline.entity.FlightEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightEventDao extends JpaRepository<FlightEvent, Long> {
    List<FlightEvent> findByFlightScheduleIdOrderByCreatedAtDesc(Long scheduleId);
}
