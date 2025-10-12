package com.sunbeam.service;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sunbeam.dao.BookingDao;
import com.sunbeam.dao.ScheduleFlightDao;
import com.sunbeam.dao.UserDao;
import com.sunbeam.entities.Booking;
import com.sunbeam.entities.User;
import com.sunbeam.request.BookingRequestDto;
import com.sunbeam.response.ApiResponse;
import com.sunbeam.response.BookingResponseDto;
import com.sunbeam.response.FlightSearchResponseDto;
import com.sunbeam.response.UserProfileDto;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;


@Service
@Transactional
public class UserServiceImpl implements UserService{
	
	@Autowired
    private ScheduleFlightDao scheduleRepo;

    @Autowired
    private BookingDao bookingRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private UserDao userDao;
    
    @Override
    public List<FlightSearchResponseDto> flightSearch(String source, String destination, LocalDate departure) {
        List<FlightSearchResponseDto> flights = scheduleRepo.searchFlights(source, destination, departure);
        return flights.stream()
                .map(flight -> modelMapper.map(flight, FlightSearchResponseDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponseDto createBooking(BookingRequestDto bookingRequestDTO) {
        // ✅ Configure ModelMapper to handle User entity mapping
        modelMapper.typeMap(BookingRequestDto.class, Booking.class)
                .addMappings(mapper -> {
                    mapper.skip(Booking::setUser); // Skip the user field during mapping
                });
        
        // Map DTO to Entity (excluding User)
        Booking booking = modelMapper.map(bookingRequestDTO, Booking.class);
        
        // ✅ Manually set the User entity
        if (bookingRequestDTO.getUserId() != null) {
            User user = userDao.findById(bookingRequestDTO.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + bookingRequestDTO.getUserId()));
            booking.setUser(user);
        }
        
        Booking savedBooking = bookingRepo.save(booking);
        return modelMapper.map(savedBooking, BookingResponseDto.class);
    }
    @Override
    public Booking getBookingById(Long bookingId) {
        // Option 1: Use the custom method (now with correct Long parameter)
        Optional<Booking> booking = bookingRepo.findByBookingId(bookingId);
        
        // Option 2: Use inherited findById method (equivalent since bookingId is @Id)
        // Optional<Booking> booking = bookingRepo.findById(bookingId);
        
        return booking.orElseThrow(() -> 
            new RuntimeException("Booking not found with ID: " + bookingId));
    }
    
//    @Override
//    public List<Booking> getBookingsByUserId(Long userId) {
//        return bookingRepo.findByUserId(userId);
//    }
    
//    @Override
//    public Booking updateBooking(Booking booking) {
//        return bookingRepo.save(booking);
//    }
//    
//    @Override
//    public void cancelBooking(Long bookingId) {
//        Booking booking = getBookingById(bookingId);
//        booking.setBookingStatus(Booking.BookingStatus.CANCELLED);
//        bookingRepo.save(booking);
//    }
    
    @Override
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    @Override
    public ApiResponse<UserProfileDto> getUserProfile(String name) {
        Optional<User> optionalUser = userDao.findByEmail(name);
        if (optionalUser.isEmpty()) {
            return new ApiResponse<>(true, "User not found",null);
        }

        UserProfileDto dto = modelMapper.map(optionalUser.get(), UserProfileDto.class);
        return new ApiResponse<>(true, "Profile fetched successfully",dto);
    }

}
