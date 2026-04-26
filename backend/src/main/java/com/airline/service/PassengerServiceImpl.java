package com.airline.service;

import com.airline.dao.BookingDao;
import com.airline.dao.PassengerDao;
import com.airline.dao.UserDao;
import com.airline.response.PassengerResponseDto;
import com.airline.entity.*;
import com.airline.exception.BadRequestException;
import com.airline.exception.ResourceNotFoundException;
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
public class PassengerServiceImpl implements PassengerService {

    private final PassengerDao passengerDao;
    private final BookingDao bookingDao;
    private final UserDao userDao;
    private final SeatAssignmentService seatAssignmentService;

    @Transactional(readOnly = true)
    public List<PassengerResponseDto> getPassengersByBooking(Long bookingId) {
        User user = getLoggedInUser();
        Booking booking = findBooking(bookingId);
        if (user.getRole() != Role.ADMIN && !booking.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Not authorized to view passengers for this booking");
        }
        return passengerDao.findByBookingId(bookingId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PassengerResponseDto getPassengerById(Long passengerId) {
        User user = getLoggedInUser();
        Passenger passenger = findPassenger(passengerId);
        if (user.getRole() != Role.ADMIN && !passenger.getBooking().getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Not authorized to view this passenger");
        }
        return mapToResponse(passenger);
    }

    @Transactional(readOnly = true)
    public List<PassengerResponseDto> getAllPassengersForSchedule(Long scheduleId) {
        return passengerDao.findAll().stream()
                .filter(p -> p.getBooking().getFlightSchedule().getId().equals(scheduleId)
                        && p.getBooking().getStatus() != BookingStatus.CANCELLED)
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PassengerResponseDto> getAllPassengers() {
        return passengerDao.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userDao.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Booking findBooking(Long id) {
        return bookingDao.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));
    }

    private Passenger findPassenger(Long id) {
        return passengerDao.findById(id).orElseThrow(() -> new ResourceNotFoundException("Passenger not found: " + id));
    }

    public PassengerResponseDto mapToResponse(Passenger p) {
        return PassengerResponseDto.builder()
                .id(p.getId())
                .bookingId(p.getBooking().getId())
                .bookingReference(p.getBooking().getBookingReference())
                .firstName(p.getFirstName())
                .lastName(p.getLastName())
                .fullName(p.getFirstName() + " " + p.getLastName())
                .gender(p.getGender().name())
                .dateOfBirth(p.getDateOfBirth())
                .idType(p.getIdType())
                .idNumber(p.getIdNumber())
                .seatNumber(p.getSeatNumber())
                .seatZone(seatAssignmentService.getSeatZone(p.getSeatNumber()))
                .createdAt(p.getCreatedAt())
                .build();
    }
}