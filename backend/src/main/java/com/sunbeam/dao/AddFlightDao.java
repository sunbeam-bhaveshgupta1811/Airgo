package com.sunbeam.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sunbeam.entities.AddFlights;

public interface AddFlightDao extends JpaRepository<AddFlights, Long>{
	 Optional<AddFlights> findByFlightNo(String flightNo);
	    void deleteByFlightNo(String flightNo);

//	@Modifying
//	@Query("DELETE FROM AddFlight f WHERE f.airline.airlineId = :airlineId")
//	void deleteByAirlineId(@Param("airlineId") Long airlineId);
}
