package com.airline.controller;

import com.airline.dto.ApiResponse;
import com.airline.response.UserProfileResponseDto;
import com.airline.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {


	@Autowired
	private final UserService userService;

//	@Autowired
//    private FeedbackService feedbackService;
//
//	@GetMapping("/flightlist")
//	public ResponseEntity<List<FlightSearchResponseDto>> searchFlights(@RequestParam String from,
//			@RequestParam String to, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
//		List<FlightSearchResponseDto> result = userService.flightSearch(from, to, date);
//		return ResponseEntity.ok(result);
//	}
//
//	@PostMapping("/bookings")
//	@PreAuthorize("hasRole('USER')")
//	public ResponseEntity<BookingResponseDto> createBooking(@RequestBody BookingRequestDto bookingRequestDto) {
//		BookingResponseDto responseDto = userService.createBooking(bookingRequestDto);
//		return ResponseEntity.ok(responseDto);
//	}
//
//	@GetMapping("/{bookingId}")
//	public ResponseEntity<Booking> getBookingById(@PathVariable String bookingId) {
//		try {
//			Long id = Long.parseLong(bookingId);
//			Booking booking = userService.getBookingById(id);
//			return ResponseEntity.ok(booking);
//		} catch (NumberFormatException e) {
//			return ResponseEntity.badRequest().build();
//		} catch (RuntimeException e) {
//			return ResponseEntity.notFound().build();
//		}
//	}

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserProfileResponseDto>> getMyProfile() {
        return ResponseEntity.ok(
                ApiResponse.success("Profile fetched successfully", userService.getMyProfile())
        );
    }
//
//	@PostMapping("/addfeedback")
//    public ResponseEntity<ApiResponse<String>> addFeedback(@RequestBody UserFeedbackRequestDto dto) {
//        ApiResponse<String> response = feedbackService.addFeedback(dto);
//        return ResponseEntity.ok(response);
//    }
//
//	@GetMapping("feedback/user/{userId}")
//    public ResponseEntity<ApiResponse<List<FeedbackDto>>> getFeedbackByUser(@PathVariable Long userId) {
//        ApiResponse<List<FeedbackDto>> response = feedbackService.getFeedbackByUserId(userId);
//        return ResponseEntity.ok(response);
//    }

}
