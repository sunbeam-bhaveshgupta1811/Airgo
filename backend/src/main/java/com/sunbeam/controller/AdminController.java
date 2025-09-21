package com.sunbeam.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sunbeam.dto.FeedbackDto;
import com.sunbeam.entities.AirlineDetail;
import com.sunbeam.entities.Feedback;
import com.sunbeam.entities.User;
import com.sunbeam.response.AirlineResponseDto;
import com.sunbeam.response.ApiResponse;
import com.sunbeam.service.AdminServiceImpl;
import com.sunbeam.service.FlightServiceImpl;


@RestController
@RequestMapping("/admin")

@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
	
	@Autowired
	public FlightServiceImpl flightServiceImpl;
	
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
	public ResponseEntity<Double> countTotalAmountBooking(){
		return ResponseEntity.ok(adminService.getTotalAmountBooking());
	}
	
	@GetMapping("/airlineManagement")
    public ResponseEntity<List<AirlineResponseDto>> getAllAirlines() {
        List<AirlineResponseDto> airlines = adminService.getAllAirlines();
        return ResponseEntity.ok(airlines);
    }
	
	@GetMapping("/feedback")
	public ResponseEntity<ApiResponse<List<FeedbackDto>>> getAllFeedback(){
		ApiResponse<List<FeedbackDto>> feedback = adminService.getAllFeedback();
		return ResponseEntity.ok(feedback);
	}
	
	@DeleteMapping("/deleteairline/{id}")
    public ResponseEntity<ApiResponse<?>> deleteAirline(@PathVariable Long id) {
		flightServiceImpl.deleteAirlineManagement(id);
        return ResponseEntity.ok(new ApiResponse<>(true,"Delete Success..",id));
    }
	

	
}
