package com.airline.service;


import com.airline.dao.UserDao;
import com.airline.entity.User;
import com.airline.exception.ResourceNotFoundException;
import com.airline.response.UserProfileResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService{
//
//	@Autowired
//    private ScheduleFlightDao scheduleRepo;
//
//    @Autowired
//    private BookingDao bookingRepo;

    private final UserDao userDao;

    @Transactional(readOnly = true)
    public UserProfileResponseDto getMyProfile() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();   // email from JWT

        User user = userDao.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return mapToProfileResponse(user);
    }

    @Transactional(readOnly = true)
    public UserProfileResponseDto getUserById(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToProfileResponse(user);
    }


    @Transactional(readOnly = true)
    public List<UserProfileResponseDto> getAllUsers() {
        return userDao.findAll()
                .stream()
                .map(user -> this.mapToProfileResponse(user))
                .collect(Collectors.toList());
    }

    private UserProfileResponseDto mapToProfileResponse(User user) {
        return UserProfileResponseDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }



//
//    @Override
//    public List<FlightSearchResponseDto> flightSearch(String source, String destination, LocalDate departure) {
//        List<FlightSearchResponseDto> flights = scheduleRepo.searchFlights(source, destination, departure);
//        return flights.stream()
//                .map(flight -> modelMapper.map(flight, FlightSearchResponseDto.class))
//                .collect(Collectors.toList());
//    }
//
//    @Override
//    public BookingResponseDto createBooking(BookingRequestDto bookingRequestDTO) {
//        // ✅ Configure ModelMapper to handle User entity mapping
//        modelMapper.typeMap(BookingRequestDto.class, Booking.class)
//                .addMappings(mapper -> {
//                    mapper.skip(Booking::setUser); // Skip the user field during mapping
//                });
//
//        // Map DTO to Entity (excluding User)
//        Booking booking = modelMapper.map(bookingRequestDTO, Booking.class);
//
//        // ✅ Manually set the User entity
//        if (bookingRequestDTO.getUserId() != null) {
//            User user = userDao.findById(bookingRequestDTO.getUserId())
//                    .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + bookingRequestDTO.getUserId()));
//            booking.setUser(user);
//        }
//
//        Booking savedBooking = bookingRepo.save(booking);
//        return modelMapper.map(savedBooking, BookingResponseDto.class);
//    }
//    @Override
//    public Booking getBookingById(Long bookingId) {
//        // Option 1: Use the custom method (now with correct Long parameter)
//        Optional<Booking> booking = bookingRepo.findByBookingId(bookingId);
//
//        // Option 2: Use inherited findById method (equivalent since bookingId is @Id)
//        // Optional<Booking> booking = bookingRepo.findById(bookingId);
//
//        return booking.orElseThrow(() ->
//            new RuntimeException("Booking not found with ID: " + bookingId));
//    }
//
////    @Override
////    public List<Booking> getBookingsByUserId(Long userId) {
////        return bookingRepo.findByUserId(userId);
////    }
//
////    @Override
////    public Booking updateBooking(Booking booking) {
////        return bookingRepo.save(booking);
////    }
////
////    @Override
////    public void cancelBooking(Long bookingId) {
////        Booking booking = getBookingById(bookingId);
////        booking.setBookingStatus(Booking.BookingStatus.CANCELLED);
////        bookingRepo.save(booking);
////    }
//
//    @Override
//    public List<Booking> getAllBookings() {
//        return bookingRepo.findAll();
//    }
//
//    @Override
//    public ApiResponse<UserProfileDto> getUserProfile(String name) {
//        Optional<User> optionalUser = userDao.findByEmail(name);
//        if (optionalUser.isEmpty()) {
//            return new ApiResponse<>(true, "User not found",null);
//        }
//
//        UserProfileDto dto = modelMapper.map(optionalUser.get(), UserProfileDto.class);
//        return new ApiResponse<>(true, "Profile fetched successfully",dto);
//    }

}
