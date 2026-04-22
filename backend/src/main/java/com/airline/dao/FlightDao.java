package com.airline.dao;

import com.airline.entity.Flight;
import com.airline.entity.FlightStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlightDao extends JpaRepository<Flight, Long> {

    boolean existsByFlightNumber(String flightNumber);
    boolean existsByFlightNumberAndIdNot(String flightNumber, Long id);

    Optional<Flight> findByFlightNumber(String flightNumber);

    List<Flight> findByStatus(FlightStatus status);

    List<Flight> findByAirlineId(Long airlineId);

    @Query("SELECT f FROM Flight f WHERE f.originAirport.id = :originId AND f.destinationAirport.id = :destinationId AND f.status = :status")
    List<Flight> findActiveFlightsByRoute(@Param("originId") Long originId,@Param("destinationId") Long destinationId,@Param("status") FlightStatus status);
}