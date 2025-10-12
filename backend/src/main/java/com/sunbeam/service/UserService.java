package com.sunbeam.service;

import java.time.LocalDate;
import java.util.List;

import com.sunbeam.entities.Booking;
import com.sunbeam.request.BookingRequestDto;
import com.sunbeam.response.ApiResponse;
import com.sunbeam.response.BookingResponseDto;
import com.sunbeam.response.FlightSearchResponseDto;
import com.sunbeam.response.UserProfileDto;

public interface UserService {
	List<FlightSearchResponseDto> flightSearch(String source, String destination, LocalDate departure);
    BookingResponseDto createBooking(BookingRequestDto bookingRequestDto);
    Booking getBookingById(Long bookingId);  // Change from String to Long
   // List<Booking> getBookingsByUserId(Long userId);
//    Booking updateBooking(Booking booking);
//    void cancelBooking(Long bookingId);
    List<Booking> getAllBookings();
    
    ApiResponse<UserProfileDto> getUserProfile(String name);
    
}
