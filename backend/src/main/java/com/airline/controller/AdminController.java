package com.airline.controller;

import com.airline.dto.ApiResponse;
import com.airline.response.UserProfileResponseDto;
import com.airline.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:3000")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserProfileResponseDto>>> getAllUsers() {
        return ResponseEntity.ok(
                ApiResponse.success("Users fetched successfully"
                        , userService.getAllUsers())
        );
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserProfileResponseDto>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("User fetched successfully", userService.getUserById(id))
        );
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<String>> dashboard() {
        return ResponseEntity.ok(
                ApiResponse.success("Welcome to Admin Dashboard", "Analytics coming soon")
        );
    }

//	@GetMapping("/airlines/count")
//	public ResponseEntity<Long> countTotalAirline(){
//		return ResponseEntity.ok(adminService.getTotalAirlinesCount());
//	}
//
//	@GetMapping("/airlines/flightcount")
//	public ResponseEntity<Long> countTotalFlight(){
//		return ResponseEntity.ok(adminService.getTotalFlightsCount());
//	}
//
//	@GetMapping("/airlines/bookingcount")
//	public ResponseEntity<Long> countTotalBooking(){
//		return ResponseEntity.ok(adminService.getTotalBooking());
//	}
//
//	@GetMapping("/airlines/totalAmountBooking")
//	public ResponseEntity<Double> countTotalAmountBooking(){
//		return ResponseEntity.ok(adminService.getTotalAmountBooking());
//	}
//
//	@GetMapping("/airlineManagement")
//    public ResponseEntity<List<AirlineResponseDto>> getAllAirlines() {
//        List<AirlineResponseDto> airlines = adminService.getAllAirlines();
//        return ResponseEntity.ok(airlines);
//    }
//
//	@GetMapping("/feedback")
//	public ResponseEntity<ApiResponse<List<FeedbackDto>>> getAllFeedback(){
//		ApiResponse<List<FeedbackDto>> feedback = adminService.getAllFeedback();
//		return ResponseEntity.ok(feedback);
//	}
//
//	@DeleteMapping("/deleteairline/{id}")
//    public ResponseEntity<ApiResponse<?>> deleteAirline(@PathVariable Long id) {
//		flightServiceImpl.deleteAirlineManagement(id);
//        return ResponseEntity.ok(new ApiResponse<>(true,"Delete Success..",id));
//    }
//
//
//
}
