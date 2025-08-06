package com.sunbeam.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sunbeam.dto.AirlineDTO;
import com.sunbeam.entities.AirlineDetail;
import com.sunbeam.entities.Feedback;
import com.sunbeam.entities.User;
import com.sunbeam.service.AdminServiceImpl;


@RestController
@RequestMapping("/admin")

@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
	
	@Autowired
	private AdminServiceImpl adminService;
	
	
	@GetMapping("/airlines/count")
	public ResponseEntity<Long> countTotalAirline(){
		return ResponseEntity.ok(adminService.getTotalAirlinesCount());
	}
	
	@GetMapping("/airlines/flightcount")
	public ResponseEntity<Long> countTotalFlight(){
		return ResponseEntity.ok(adminService.getTotalFlightsCount());
	}
	
	@GetMapping("/airlines/bookingcount")
	public ResponseEntity<Long> countTotalBooking(){
		return ResponseEntity.ok(adminService.getTotalBooking());
	}
	
	@GetMapping("/airlines/totalAmountBooking")
	public ResponseEntity<Long> countTotalAmountBooking(){
		return ResponseEntity.ok(adminService.getTotalAmountBooking());
	}
	
	@GetMapping("/airlineManagement")
    public ResponseEntity<List<AirlineDetail>> getAllAirlines() {
        List<AirlineDetail> airlines = adminService.getAllAirlines();
        return ResponseEntity.ok(airlines);
    }
@PostMapping("/addairline")
    public ResponseEntity<?> addAirline(@RequestBody AirlineDTO dto) {
        return ResponseEntity.ok(adminService.addAirline(dto));
    }
	
	@GetMapping("/feedback")
	public ResponseEntity<List<FeedbackResponseDTO>> getAllFeedback(){
		List<FeedbackResponseDTO> feedback = adminService.getAllFeedback();
		return ResponseEntity.ok(feedback);
	}
	
	@GetMapping("/profile")
	public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
	    return adminService.getUserByEmail(email)
	            .map(user -> ResponseEntity.ok().body(user))
	            .orElseThrow();
	}

	
}
