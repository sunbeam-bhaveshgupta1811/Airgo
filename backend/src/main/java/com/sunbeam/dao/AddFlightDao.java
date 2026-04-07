package com.sunbeam.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sunbeam.entities.AddFlights;

public interface AddFlightDao extends JpaRepository<AddFlights, Long>{
	 Optional<AddFlights> findByFlightNo(String flightNo);
	    void deleteByFlightNo(String flightNo);

}
