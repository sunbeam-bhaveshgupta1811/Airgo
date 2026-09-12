package com.airline.reservation.service;

import com.airline.reservation.repository.BookingRepository;
import com.airline.reservation.repository.PassengerRepository;
import com.airline.reservation.dto.response.PassengerResponseDto;
import com.airline.reservation.entity.*;
import com.airline.reservation.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PassengerServiceImpl implements PassengerService {

    private final PassengerRepository passengerRepository;
    private final BookingRepository bookingRepository;
    private final SeatAssignmentService seatAssignmentService;
    private final com.airline.reservation.security.AccessGuard accessGuard;

    @Transactional(readOnly = true)
    public List<PassengerResponseDto> getPassengersByBooking(Long bookingId) {
        Booking booking = findBooking(bookingId);
        accessGuard.requireOwnerOrAdmin(booking.getUser(), "booking");
        return passengerRepository.findByBookingId(bookingId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PassengerResponseDto getPassengerById(Long passengerId) {
        Passenger passenger = findPassenger(passengerId);
        accessGuard.requireOwnerOrAdmin(passenger.getBooking().getUser(), "passenger");
        return mapToResponse(passenger);
    }

    @Transactional(readOnly = true)
    public List<PassengerResponseDto> getAllPassengersForSchedule(Long scheduleId) {
        return passengerRepository.findByScheduleId(scheduleId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PassengerResponseDto> getAllPassengers() {
        return passengerRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private Booking findBooking(Long id) {
        return bookingRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));
    }

    private Passenger findPassenger(Long id) {
        return passengerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Passenger not found: " + id));
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