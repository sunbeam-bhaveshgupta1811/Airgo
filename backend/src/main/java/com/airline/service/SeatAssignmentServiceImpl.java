package com.airline.service;

import com.airline.dao.BookingDao;
import com.airline.dao.PassengerDao;
import com.airline.dto.ApiResponse;
import com.airline.response.SeatAssignmentResponse;
import com.airline.response.SeatMapResponse;
import com.airline.entity.*;
import com.airline.exception.BadRequestException;
import com.airline.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SeatAssignmentServiceImpl implements SeatAssignmentService {

    private final PassengerDao passengerDao;
    private final BookingDao bookingDao;

    private static final int BUSINESS_START  = 1;
    private static final int BUSINESS_END    = 4;   // rows 1-4  (24 seats)
    private static final int PREMIUM_START   = 5;
    private static final int PREMIUM_END     = 10;  // rows 5-10 (36 seats)
    private static final int ECONOMY_START   = 11;
    private static final int ECONOMY_END     = 40;  // rows 11-40 (180 seats)
    private static final String[] COLUMNS    = {"A", "B", "C", "D", "E", "F"};

    @Transactional
    public void assignSeats(Booking booking) {

        List<Passenger> passengers = passengerDao.findByBookingId(booking.getId());
        if (passengers.isEmpty()) {
            log.warn("No passengers found for booking {}", booking.getBookingReference());
            return;
        }

        boolean allAssigned = passengers.stream()
                .allMatch(p -> p.getSeatNumber() != null && !p.getSeatNumber().isBlank());
        if (allAssigned) {
            log.info("Seats already assigned for booking {}", booking.getBookingReference());
            return;
        }

        List<String> occupiedSeats = getOccupiedSeats(booking);
        List<String> availableSeats = generateAvailableEconomySeats(occupiedSeats);

        for (int i = 0; i < passengers.size(); i++) {
            Passenger passenger = passengers.get(i);
            if (passenger.getSeatNumber() != null && !passenger.getSeatNumber().isBlank()) {
                continue;
            }
            if (i < availableSeats.size()) {
                passenger.setSeatNumber(availableSeats.get(i));
            } else {
                passenger.setSeatNumber("STANDBY-" + (i + 1));
                log.warn("No seat available for passenger {} in booking {}",
                        passenger.getId(), booking.getBookingReference());
            }
        }

        passengerDao.saveAll(passengers);
        log.info("Seats assigned to {} passengers for booking {}",
                passengers.size(), booking.getBookingReference());
    }

    @Transactional
    public SeatAssignmentResponse assignSeatToPassenger(Long passengerId, String requestedSeat) {

        Passenger passenger = passengerDao.findById(passengerId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Passenger not found with id: " + passengerId));

        String seat = requestedSeat.toUpperCase().trim();

        if (!seat.matches("^([1-9]|[1-3][0-9]|40)[A-F]$")) {
            throw new BadRequestException(
                    "Invalid seat format: " + seat + ". Use format like 12A (rows 1-40, columns A-F)");
        }

        List<String> occupied = getOccupiedSeats(passenger.getBooking());
        if (occupied.contains(seat)
                && !seat.equals(passenger.getSeatNumber())) {
            throw new BadRequestException("Seat " + seat + " is already occupied");
        }

        String oldSeat = passenger.getSeatNumber();
        passenger.setSeatNumber(seat);
        passengerDao.save(passenger);

        log.info("Seat manually assigned: Passenger {} → {} (was {})",
                passengerId, seat, oldSeat);

        return SeatAssignmentResponse.builder()
                .passengerId(passenger.getId())
                .passengerName(passenger.getFirstName() + " " + passenger.getLastName())
                .bookingReference(passenger.getBooking().getBookingReference())
                .oldSeat(oldSeat)
                .newSeat(seat)
                .seatZone(getSeatZone(seat))
                .message("Seat " + seat + " assigned successfully")
                .build();
    }

    @Transactional
    public ApiResponse<Void> reassignSeats(Long bookingId) {

        Booking booking = bookingDao.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + bookingId));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot reassign seats for a cancelled booking");
        }

        List<Passenger> passengers = passengerDao.findByBookingId(bookingId);
        passengers.forEach(p -> p.setSeatNumber(null));
        passengerDao.saveAll(passengers);

        assignSeats(booking);

        return ApiResponse.success("Seats reassigned successfully for booking "
                + booking.getBookingReference(), null);
    }


    @Transactional(readOnly = true)
    public SeatMapResponse getSeatMap(Long scheduleId) {

        List<String> occupiedSeats = passengerDao.findOccupiedSeatsByScheduleId(scheduleId);

        List<SeatMapResponse.SeatInfo> allSeats = new ArrayList<>();
        for (int row = BUSINESS_START; row <= ECONOMY_END; row++) {
            for (String col : COLUMNS) {
                String seatNo = row + col;
                allSeats.add(SeatMapResponse.SeatInfo.builder()
                        .seatNumber(seatNo)
                        .zone(getSeatZone(seatNo))
                        .occupied(occupiedSeats.contains(seatNo))
                        .build());
            }
        }

        long totalSeats    = allSeats.size();
        long occupied      = allSeats.stream().filter(SeatMapResponse.SeatInfo::isOccupied).count();
        long available     = totalSeats - occupied;

        return SeatMapResponse.builder()
                .scheduleId(scheduleId)
                .totalSeats((int) totalSeats)
                .occupiedSeats((int) occupied)
                .availableSeats((int) available)
                .seats(allSeats)
                .build();
    }

    @Transactional(readOnly = true)
    public List<SeatAssignmentResponse> getSeatAssignmentsByBooking(Long bookingId) {

        Booking booking = bookingDao.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + bookingId));

        return passengerDao.findByBookingId(bookingId)
                .stream()
                .map(p -> SeatAssignmentResponse.builder()
                        .passengerId(p.getId())
                        .passengerName(p.getFirstName() + " " + p.getLastName())
                        .bookingReference(booking.getBookingReference())
                        .newSeat(p.getSeatNumber())
                        .seatZone(p.getSeatNumber() != null ? getSeatZone(p.getSeatNumber()) : "Not assigned")
                        .message(p.getSeatNumber() != null ? "Assigned" : "Pending assignment")
                        .build())
                .collect(Collectors.toList());
    }

    private List<String> getOccupiedSeats(Booking booking) {
        return passengerDao.findOccupiedSeatsByScheduleId(
                booking.getFlightSchedule().getId());
    }

    private List<String> generateAvailableEconomySeats(List<String> occupied) {
        List<String> available = new ArrayList<>();
        for (int row = ECONOMY_START; row <= ECONOMY_END; row++) {
            for (String col : COLUMNS) {
                String seat = row + col;
                if (!occupied.contains(seat)) {
                    available.add(seat);
                }
            }
        }
        return available;
    }

    public String getSeatZone(String seatNumber) {
        if (seatNumber == null) return "Unknown";
        try {
            int row = Integer.parseInt(seatNumber.replaceAll("[A-F]", ""));
            if (row >= BUSINESS_START && row <= BUSINESS_END) return "Business";
            if (row >= PREMIUM_START  && row <= PREMIUM_END)  return "Premium Economy";
            return "Economy";
        } catch (Exception e) {
            return "Economy";
        }
    }
}