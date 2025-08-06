package com.sunbeam.service;

import com.sunbeam.dto.AirlineDTO;
import com.sunbeam.entities.AirlineDetail;

public interface FlightService {

	AirlineDTO addAirline(AirlineDTO airlineDTO);
	Boolean airlineDelete(Long id);
}
