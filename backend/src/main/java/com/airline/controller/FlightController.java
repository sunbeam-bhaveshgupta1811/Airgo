//package com.airline.controller;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.airline.request.AirlineRequestDto;
//import com.airline.request.FlightRequestDto;
//import com.airline.request.PassengerRequestDto;
//import com.airline.request.ScheduleFlightRequestDto;
//import com.airline.response.AirlineResponseDto;
//import com.airline.dto.ApiResponse;
//import com.airline.response.FlightResponseDto;
//import com.airline.response.PassengerResponseDto;
//import com.airline.response.ScheduleFlightResponseDto;
//import com.airline.service.FlightServiceImpl;
//
//@RestController
//@RequestMapping("/admin")
//@CrossOrigin(origins = "http://localhost:3000")
//public class FlightController {
//
//	@Autowired
//	public FlightServiceImpl flightServiceImpl;
//
//	@PostMapping("/addairline")
//	public ResponseEntity<ApiResponse<AirlineResponseDto>> addAirline(@RequestBody AirlineRequestDto dto) {
//        return ResponseEntity.ok(flightServiceImpl.addAirline(dto));
//    }
//
//	@GetMapping("/allflight")
//	public ResponseEntity<List<FlightResponseDto>> allflight() {
//        return ResponseEntity.ok(flightServiceImpl.getAllFlight());
//    }
//
//	@PostMapping("/addflight")
//	public ResponseEntity<ApiResponse<FlightResponseDto>> addNewFlight(@RequestBody FlightRequestDto dto) {
//        return ResponseEntity.ok(flightServiceImpl.addFlight(dto));
//    }
//
//	@GetMapping("/allscheduleflight")
//	public ResponseEntity<List<ScheduleFlightResponseDto>> allScheduleFlight() {
//        return ResponseEntity.ok(flightServiceImpl.getAllScheduleFlight());
//    }
//
//
//	@PostMapping("/addscheduleflight")
//	public ResponseEntity<ApiResponse<ScheduleFlightResponseDto>> addNewFlight(@RequestBody ScheduleFlightRequestDto dto) {
//        return ResponseEntity.ok(flightServiceImpl.addScheduleFlight(dto));
//    }
//
//	@PutMapping("/scheduleflight/{id}")
//	public ResponseEntity<ApiResponse<ScheduleFlightResponseDto>> UpdateFlight(@PathVariable Long id,@RequestBody ScheduleFlightRequestDto dto) {
//        return ResponseEntity.ok(flightServiceImpl.updateScheduleFlight(id,dto));
//    }
//
//	@GetMapping("/allpassengers")
//	public ResponseEntity<List<PassengerResponseDto>> allPassengers() {
//        return ResponseEntity.ok(flightServiceImpl.getAllPassengers());
//    }
//
//	@PostMapping("/addpassengers")
//	public ResponseEntity<ApiResponse<List<PassengerResponseDto>>> allPassengers(@RequestBody List<PassengerRequestDto> list) {
//        return ResponseEntity.ok(flightServiceImpl.addPassenger(list));
//    }
//
//	@DeleteMapping("/scheduleflight/{id}")
//    public ResponseEntity<ApiResponse<?>> deleteScheduleFlight(@PathVariable Long id) {
//		flightServiceImpl.deleteScheduleFlight(id);
//        return ResponseEntity.ok(new ApiResponse<>(true,"Delete Success..",id));
//    }
//
//	@GetMapping("/scheduleflight/{id}")
//	public ResponseEntity<FlightResponseDto> getByIdFlight(@PathVariable Long id) {
//        return ResponseEntity.ok(flightServiceImpl.getFlightById(id));
//    }
//
//	@DeleteMapping("/deleteflight/{flightName}")
//    public ResponseEntity<ApiResponse<?>> deleteFlight(@PathVariable String flightName) {
//		flightServiceImpl.deleteFlight(flightName);
//        return ResponseEntity.ok(new ApiResponse<>(true,"Delete Success..",flightName));
//    }
//
//
//}
