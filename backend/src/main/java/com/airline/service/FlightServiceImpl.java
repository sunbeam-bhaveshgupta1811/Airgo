//package com.sunbeam.service;
//
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Optional;
//
//import org.modelmapper.ModelMapper;
//import org.springframework.stereotype.Service;
//
//import com.sunbeam.dao.AddAirlineDao;
//import com.sunbeam.dao.AddFlightDao;
//import com.sunbeam.dao.BookingDao;
//import com.sunbeam.dao.PassengerDao;
//import com.sunbeam.dao.ScheduleFlightDao;
//import com.sunbeam.dao.UserDao;
//import com.sunbeam.entities.AddFlights;
//import com.sunbeam.entities.AirlineDetail;
//import com.sunbeam.entities.Booking;
//import com.sunbeam.entities.Passenger;
//import com.sunbeam.entities.ScheduleFlight;
//import com.sunbeam.entities.User;
//import com.sunbeam.exception.AirlineAlreadyExistsException;
//import com.sunbeam.exception.ResourceNotFoundException;
//import com.sunbeam.exception.ScheduleAlreadyExistsException;
//import com.sunbeam.exception.UserAlreadyExistsException;
//import com.sunbeam.exception.UserAlreadyExistsException;
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
//import jakarta.transaction.Transactional;
//import lombok.AllArgsConstructor;
//
//@Service
//@Transactional
//@AllArgsConstructor
//public class FlightServiceImpl implements FlightService {
//
//	public ModelMapper modelMapper;
//
//	public AddAirlineDao addAirlineDao;
//
//	public AddFlightDao addFlightdao;
//
//	public ScheduleFlightDao scheduleFlightDao;
//
//	public PassengerDao passengerDao;
//
//	public UserDao userDao;
//
//	public BookingDao bookingDao;
//
//	@Override
//	public ApiResponse<AirlineResponseDto> addAirline(AirlineRequestDto airlineDTO) {
//
//		addAirlineDao.findByAirlineName(airlineDTO.getAirlineName()).ifPresent(existing -> {
//			throw new AirlineAlreadyExistsException(
//					"Airline with name '" + airlineDTO.getAirlineName() + "' already exists");
//		});
//
//		AirlineDetail airlineDetail = modelMapper.map(airlineDTO, AirlineDetail.class);
//		airlineDetail.setDate(LocalDateTime.now());
//		User admin = userDao.findById(airlineDTO.getAdminId())
//				.orElseThrow(() -> new RuntimeException("Admin not found"));
//
//		airlineDetail.setAdmin(admin);
//
//		AirlineDetail saved = addAirlineDao.save(airlineDetail);
//
//		AirlineResponseDto responseDto = modelMapper.map(saved, AirlineResponseDto.class);
//
//		return new ApiResponse<>(true, "Airline added successfully", responseDto);
//
//	}
//
//	@Override
//	public List<FlightResponseDto> getAllFlight() {
//
//		List<AddFlights> addFlights = addFlightdao.findAll();
//		List<FlightResponseDto> list = new ArrayList<>();
//
//		for (AddFlights add : addFlights) {
//			FlightResponseDto flightResponseDto = modelMapper.map(add, FlightResponseDto.class);
//			flightResponseDto.setAirlineId(add.getFlightId());
//			list.add(flightResponseDto);
//		}
//
//		return list;
//	}
//
//	@Override
//	public ApiResponse<FlightResponseDto> addFlight(FlightRequestDto dto) {
//
//		AddFlights flight = modelMapper.map(dto, AddFlights.class);
//
//		flight.setAirlineDetail(addAirlineDao.findById(dto.getAirlineId())
//				.orElseThrow(() -> new RuntimeException("Airline not found")));
//		flight.setAdmin(userDao.findById(dto.getAdminId()).orElseThrow(() -> new RuntimeException("Admin not found")));
//
//		FlightResponseDto flightResponseDto = modelMapper.map(addFlightdao.save(flight), FlightResponseDto.class);
//		flightResponseDto.setAirlineId(dto.getAirlineId());
//
//		return new ApiResponse<>(true, "Successfully Added Flight", flightResponseDto);
//	}
//
//	@Override
//	public List<ScheduleFlightResponseDto> getAllScheduleFlight() {
//
//		List<ScheduleFlight> addSchFlights = scheduleFlightDao.findAll();
//		List<ScheduleFlightResponseDto> list = new ArrayList<>();
//
//		for (ScheduleFlight add : addSchFlights) {
//			ScheduleFlightResponseDto flightResponseDto = modelMapper.map(add, ScheduleFlightResponseDto.class);
//			list.add(flightResponseDto);
//		}
//
//		return list;
//	}
//
//	@Override
//	public ApiResponse<ScheduleFlightResponseDto> addScheduleFlight(ScheduleFlightRequestDto dto) {
//
//		scheduleFlightDao.findByFlight_FlightIdAndArrivalAndDepartureAndSourceAndDestination(dto.getFlightId(),
//				dto.getArrival(), dto.getDeparture(), dto.getSource(), dto.getDestination()).ifPresent(f -> {
//					throw new ScheduleAlreadyExistsException(
//							"This flight is already scheduled for given date & route!");
//				});
//
//		ScheduleFlight flight = modelMapper.map(dto, ScheduleFlight.class);
//
//		flight.setFlight(
//				addFlightdao.findById(dto.getFlightId()).orElseThrow(() -> new RuntimeException("Flight not found")));
//
//		flight.setAdmin(userDao.findById(dto.getAdminId()).orElseThrow(() -> new RuntimeException("Admin not found")));
//
//		ScheduleFlightResponseDto flightResponseDto = modelMapper.map(scheduleFlightDao.save(flight),
//				ScheduleFlightResponseDto.class);
//
//		return new ApiResponse<>(true, "Successfully Added Flight", flightResponseDto);
//	}
//
//	@Override
//	public List<PassengerResponseDto> getAllPassengers() {
//		List<Passenger> passg = passengerDao.findAllWithBookingAndUser();
//		List<PassengerResponseDto> list = new ArrayList<>();
//
//		for (Passenger add : passg) {
//			PassengerResponseDto flightResponseDto = modelMapper.map(add, PassengerResponseDto.class);
//			flightResponseDto.setBookingId(add.getBooking().getBookingId());
//			flightResponseDto.setPhoneNumber(add.getBooking().getUser().getMobile_no());
//			list.add(flightResponseDto);
//		}
//		return list;
//	}
//
//	@Override
//	public ApiResponse<List<PassengerResponseDto>> addPassenger(List<PassengerRequestDto> list) {
//
//		if (list.isEmpty()) {
//            throw new RuntimeException("Passenger list cannot be empty!");
//        }
//
//        Long bookingId = list.get(0).getBookingId();
//
//        Booking booking = bookingDao.findById(bookingId)
//                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));
//
//        List<Passenger> passengers = list.stream()
//                .map(dto -> {
//                    Passenger passenger = modelMapper.map(dto, Passenger.class);
//                    passenger.setBooking(booking);
//                    return passenger;
//                })
//                .toList();
//
//        List<Passenger> savedPassengers = passengerDao.saveAll(passengers);
//
//        List<PassengerResponseDto> responseDtos = savedPassengers.stream()
//                .map(p -> {
//                    PassengerResponseDto res = modelMapper.map(p, PassengerResponseDto.class);
//                    res.setBookingId(p.getBooking().getBookingId());
//                    return res;
//                })
//                .toList();
//
//        return new ApiResponse<>(true, "Passengers added successfully to booking " + bookingId, responseDtos);
//    }
//
//	@Override
//	public ApiResponse<ScheduleFlightResponseDto> updateScheduleFlight(Long id,ScheduleFlightRequestDto dto) {
//		ScheduleFlight existingFlight = scheduleFlightDao.findById(id)
//	            .orElseThrow(() -> new RuntimeException("Schedule Flight not found"));
//
//	    scheduleFlightDao.findByFlight_FlightIdAndArrivalAndDepartureAndSourceAndDestination(
//	            dto.getFlightId(), dto.getArrival(), dto.getDeparture(),
//	            dto.getSource(), dto.getDestination()
//	    ).ifPresent(f -> {
//	        if (!f.getSchFlightId().equals(id)) {
//	            throw new ScheduleAlreadyExistsException(
//	                "This flight is already scheduled for given date & route!"
//	            );
//	        }
//	    });
//
//	    modelMapper.map(dto, existingFlight);
//
//	    existingFlight.setFlight(addFlightdao.findById(dto.getFlightId())
//	            .orElseThrow(() -> new RuntimeException("Flight not found")));
//
//	    existingFlight.setAdmin(userDao.findById(dto.getAdminId())
//	            .orElseThrow(() -> new RuntimeException("Admin not found")));
//
//	    ScheduleFlight updated = scheduleFlightDao.save(existingFlight);
//
//	    ScheduleFlightResponseDto responseDto = modelMapper.map(updated, ScheduleFlightResponseDto.class);
//
//	    return new ApiResponse<>(true, "Schedule Flight updated successfully", responseDto);
//
//	}
//
//	@Override
//	public void deleteScheduleFlight(Long id) {
//		if (!scheduleFlightDao.existsById(id)) {
//            throw new ResourceNotFoundException("ScheduleFlight with id " + id + " not found");
//        }
//		scheduleFlightDao.deleteById(id);
//	}
//
//
//	@Override
//	public void deleteAirlineManagement(Long id) {
//		if (!addAirlineDao.existsById(id)) {
//            throw new ResourceNotFoundException("Airline with id " + id + " not found");
//        }
//		addAirlineDao.deleteById(id);
//	}
//
//
//	@Override
//	public FlightResponseDto getFlightById(Long id) {
//	    ScheduleFlight scheduleFlight = scheduleFlightDao.findById(id)
//	        .orElseThrow(() -> new ResourceNotFoundException("ScheduleFlight with id " + id + " not found"));
//	    return modelMapper.map(scheduleFlight, FlightResponseDto.class);
//	}
//
//	@Override
//	public void deleteFlight(String flightName) {
//	    Optional<AddFlights> optionalFlight = addFlightdao.findByFlightNo(flightName);
//
//	    if (optionalFlight.isEmpty()) {
//	        throw new ResourceNotFoundException("Flight with name " + flightName + " not found");
//	    }
//
//	    addFlightdao.delete(optionalFlight.get());
//	}
//
//
//
//
//
//
//}
