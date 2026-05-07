package com.airline.service;
import com.airline.dto.ApiResponse;
import com.airline.request.BookingRequestDto;
import com.airline.request.PassengerRequestDto;
import com.airline.response.BookingResponseDto;

import java.util.List;

public interface BookingService {
    BookingResponseDto createBooking(BookingRequestDto request);
    BookingResponseDto addPassengers(Long bookingId, List<PassengerRequestDto> requests);
    List<BookingResponseDto> getMyBookings();
    ApiResponse<Void> cancelBooking(Long bookingId);
    BookingResponseDto getBookingById(Long id);
    BookingResponseDto getBookingByReference(String reference);
    List<BookingResponseDto> getAllBookings();
}
