package com.sunbeam.controller;

import java.time.LocalDate;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sunbeam.entities.Booking;
import com.sunbeam.request.BookingRequestDto;
import com.sunbeam.request.RegistrationRequestDto;
import com.sunbeam.request.LoginRequestDto;
import com.sunbeam.response.ApiResponse;
import com.sunbeam.response.BookingResponseDto;
import com.sunbeam.response.FlightSearchResponseDto;
import com.sunbeam.response.ProfileResponseDto;
import com.sunbeam.response.RegistrationResponseDto;
import com.sunbeam.service.AuthService;
import com.sunbeam.service.UserService;

@RestController
@RequestMapping("/customer")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

	@Autowired
	private AuthService authService;

	@Autowired
	private UserService userService;

	@PostMapping("/register")
	public ResponseEntity<ApiResponse<RegistrationResponseDto>> registerUser(@RequestBody RegistrationRequestDto dto) {
		ApiResponse<RegistrationResponseDto> response = authService.register(dto);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password) {
		return ResponseEntity.ok(authService.login(email, password));
	}

	@GetMapping("/flightlist")
	public ResponseEntity<List<FlightSearchResponseDto>> searchFlights(@RequestParam String from,
			@RequestParam String to, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		List<FlightSearchResponseDto> result = userService.flightSearch(from, to, date);
		return ResponseEntity.ok(result);
	}

	@PostMapping("/bookings")
	public ResponseEntity<BookingResponseDto> createBooking(@RequestBody BookingRequestDto bookingRequestDto) {
		BookingResponseDto responseDto = userService.createBooking(bookingRequestDto);
		return ResponseEntity.ok(responseDto);
	}

	@GetMapping("/{bookingId}")
	public ResponseEntity<Booking> getBookingById(@PathVariable String bookingId) {
		try {
			// Convert String to Long
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
	public ResponseEntity<ApiResponse<ProfileResponseDto>> getProfile(Long id) {
		return ResponseEntity.ok(userService.getUserProfile(id));
	}

}
