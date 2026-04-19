//package com.sunbeam.service;
//
//import java.util.List;
//
//import com.sunbeam.request.AirlineRequestDto;
//import com.sunbeam.request.FlightRequestDto;
//import com.sunbeam.request.PassengerRequestDto;
//import com.sunbeam.request.ScheduleFlightRequestDto;
//import com.sunbeam.response.AirlineResponseDto;
//import com.sunbeam.response.ApiResponse;
//import com.sunbeam.response.FlightResponseDto;
//import com.sunbeam.response.PassengerResponseDto;
//import com.sunbeam.response.ScheduleFlightResponseDto;
//
//public interface FlightService {
//
//	ApiResponse<AirlineResponseDto> addAirline(AirlineRequestDto airlineDTO);
//	List<FlightResponseDto> getAllFlight();
//	ApiResponse<FlightResponseDto> addFlight(FlightRequestDto dto);
//	List<ScheduleFlightResponseDto> getAllScheduleFlight();
//
//	ApiResponse<ScheduleFlightResponseDto> addScheduleFlight(ScheduleFlightRequestDto dto);
//	List<PassengerResponseDto> getAllPassengers();
//	ApiResponse<List<PassengerResponseDto>> addPassenger(List<PassengerRequestDto> list);
//
//	ApiResponse<ScheduleFlightResponseDto> updateScheduleFlight(Long id,ScheduleFlightRequestDto dto);
//
//	void deleteScheduleFlight(Long id);
//	FlightResponseDto getFlightById(Long id);
//	void deleteAirlineManagement(Long id);
//	void deleteFlight(String flightName);
//}
