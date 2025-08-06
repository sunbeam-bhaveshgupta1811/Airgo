package com.sunbeam.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sunbeam.dto.AirlineDTO;
import com.sunbeam.service.FlightServiceImpl;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class FlightController {
	
//	@Autowired
//	public FlightServiceImpl flightServiceImpl;
//
//	@PostMapping("/addairline")
//	public ResponseEntity<?> addAirline(@RequestBody AirlineDTO dto) {
//        return ResponseEntity.ok(flightServiceImpl.addAirline(dto));
//    }
	
	@DeleteMapping("/deleteairline/{id}")
	public ResponseEntity<?> deleteAirline(@PathVariable Long id) {
	    boolean deleted = flightServiceImpl.airlineDelete(id);
	    if (deleted) {
	        return ResponseEntity.ok("Airline deleted successfully");
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Airline not found");
	    }
	}




	
	
}
