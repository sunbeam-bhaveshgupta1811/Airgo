package com.sunbeam.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sunbeam.dto.FeedbackDto;
import com.sunbeam.entities.Booking;
import com.sunbeam.request.BookingRequestDto;
import com.sunbeam.request.UserFeedbackRequestDto;
import com.sunbeam.response.ApiResponse;
import com.sunbeam.response.BookingResponseDto;
import com.sunbeam.response.FlightSearchResponseDto;
import com.sunbeam.response.UserProfileDto;
import com.sunbeam.service.FeedbackService;
import com.sunbeam.service.UserService;

@RestController
@RequestMapping("/customer")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {


	@Autowired
	private UserService userService;
	
	@Autowired
    private FeedbackService feedbackService;

	@GetMapping("/flightlist")
	public ResponseEntity<List<FlightSearchResponseDto>> searchFlights(@RequestParam String from,
			@RequestParam String to, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		List<FlightSearchResponseDto> result = userService.flightSearch(from, to, date);
		return ResponseEntity.ok(result);
	}

	@PostMapping("/bookings")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<BookingResponseDto> createBooking(@RequestBody BookingRequestDto bookingRequestDto) {
		BookingResponseDto responseDto = userService.createBooking(bookingRequestDto);
		return ResponseEntity.ok(responseDto);
	}

	@GetMapping("/{bookingId}")
	public ResponseEntity<Booking> getBookingById(@PathVariable String bookingId) {
		try {
			Long id = Long.parseLong(bookingId);
			Booking booking = userService.getBookingById(id);
			return ResponseEntity.ok(booking);
		} catch (NumberFormatException e) {
			return ResponseEntity.badRequest().build();
		} catch (RuntimeException e) {
			return ResponseEntity.notFound().build();
		}
	}

	@GetMapping("/profile")
	public ResponseEntity<ApiResponse<UserProfileDto>> getProfile(Authentication authentication) {
		return ResponseEntity.ok(userService.getUserProfile(authentication.getName()));
	}
	
	@PostMapping("/addfeedback")
    public ResponseEntity<ApiResponse<String>> addFeedback(@RequestBody UserFeedbackRequestDto dto) {
        ApiResponse<String> response = feedbackService.addFeedback(dto);
        return ResponseEntity.ok(response);
    }
	
	@GetMapping("feedback/user/{userId}")
    public ResponseEntity<ApiResponse<List<FeedbackDto>>> getFeedbackByUser(@PathVariable Long userId) {
        ApiResponse<List<FeedbackDto>> response = feedbackService.getFeedbackByUserId(userId);
        return ResponseEntity.ok(response);
    }

}
