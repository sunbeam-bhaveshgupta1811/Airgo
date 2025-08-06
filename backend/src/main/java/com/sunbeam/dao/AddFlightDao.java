package com.sunbeam.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sunbeam.entities.AddFlights;

public interface AddFlightDao extends JpaRepository<AddFlights, Long>{

//	@Modifying
//	@Query("DELETE FROM AddFlight f WHERE f.airline.airlineId = :airlineId")
//	void deleteByAirlineId(@Param("airlineId") Long airlineId);
}
