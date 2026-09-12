package com.airline.reservation.service;
import com.airline.reservation.dto.ApiResponse;
import com.airline.reservation.dto.request.BookingRequestDto;
import com.airline.reservation.dto.request.PassengerRequestDto;
import com.airline.reservation.dto.response.BookingResponseDto;

import java.util.List;

public interface BookingService {
    BookingResponseDto createBooking(BookingRequestDto request);
    BookingResponseDto addPassengers(Long bookingId, List<PassengerRequestDto> requests);
    List<BookingResponseDto> getMyBookings();
    ApiResponse<Void> cancelBooking(Long bookingId);
    BookingResponseDto getBookingById(Long id);
    BookingResponseDto getBookingByReference(String reference);
    List<BookingResponseDto> getAllBookings();
    List<BookingResponseDto> getBookingsByAirport(Long airportId);
}
