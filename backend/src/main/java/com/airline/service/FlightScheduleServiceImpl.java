package com.airline.service;

import com.airline.dao.*;
import com.airline.dto.*;
import com.airline.entity.*;
import com.airline.exception.*;
import com.airline.request.FlightScheduleRequestDto;
import com.airline.request.FlightSearchRequestDto;
import com.airline.response.FlightScheduleResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FlightScheduleServiceImpl implements FlightScheduleService {

    private final FlightScheduleDao scheduleDao;
    private final FlightDao flightDao;
    private final AirportDao airportDao;

    @Transactional
    public FlightScheduleResponseDto addSchedule(FlightScheduleRequestDto request) {

        Flight flight = findFlight(request.getFlightId());

        if (flight.getStatus() == FlightStatus.INACTIVE) {
            throw new BadRequestException(
                    "Cannot schedule an inactive flight: " + flight.getFlightNumber());
        }

        if (scheduleDao.existsByFlightIdAndJourneyDateAndDepartureTime(
                request.getFlightId(), request.getJourneyDate(), request.getDepartureTime())) {
            throw new DuplicateResourceException(
                    "A schedule already exists for flight " + flight.getFlightNumber()
                            + " on " + request.getJourneyDate()
                            + " at " + request.getDepartureTime());
        }

        if (!request.getArrivalTime().isAfter(request.getDepartureTime())) {
            throw new BadRequestException("Arrival time must be after departure time");
        }

        FlightSchedule schedule = FlightSchedule.builder()
                .flight(flight)
                .journeyDate(request.getJourneyDate())
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .price(request.getPrice())
                .totalSeats(request.getTotalSeats())
                .availableSeats(request.getTotalSeats())
                .status(ScheduleStatus.SCHEDULED)
                .build();

        FlightSchedule saved = scheduleDao.save(schedule);
        log.info("Schedule added: Flight {} on {}", flight.getFlightNumber(), request.getJourneyDate());
        return mapToResponse(saved);
    }

    @Transactional
    public FlightScheduleResponseDto updateSchedule(Long id, FlightScheduleRequestDto request) {

        FlightSchedule schedule = findScheduleById(id);

        if (schedule.getStatus() == ScheduleStatus.CANCELLED
                || schedule.getStatus() == ScheduleStatus.COMPLETED) {
            throw new BadRequestException(
                    "Cannot update a " + schedule.getStatus().name().toLowerCase() + " schedule");
        }

        Flight flight = findFlight(request.getFlightId());

        if (!request.getArrivalTime().isAfter(request.getDepartureTime())) {
            throw new BadRequestException("Arrival time must be after departure time");
        }

        schedule.setFlight(flight);
        schedule.setJourneyDate(request.getJourneyDate());
        schedule.setDepartureTime(request.getDepartureTime());
        schedule.setArrivalTime(request.getArrivalTime());
        schedule.setPrice(request.getPrice());
        schedule.setTotalSeats(request.getTotalSeats());

        FlightSchedule updated = scheduleDao.save(schedule);
        log.info("Schedule updated: id {}", id);
        return mapToResponse(updated);
    }

    @Transactional
    public ApiResponse<Void> cancelSchedule(Long id) {

        FlightSchedule schedule = findScheduleById(id);

        if (schedule.getStatus() == ScheduleStatus.CANCELLED) {
            throw new BadRequestException("Schedule is already cancelled");
        }
        if (schedule.getStatus() == ScheduleStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed schedule");
        }

        schedule.setStatus(ScheduleStatus.CANCELLED);
        scheduleDao.save(schedule);
        log.info("Schedule cancelled: id {}", id);
        return ApiResponse.success("Schedule cancelled successfully", null);
    }

    @Transactional
    public FlightScheduleResponseDto updateScheduleStatus(Long id, String statusStr) {

        FlightSchedule schedule = findScheduleById(id);

        ScheduleStatus newStatus;
        try {
            newStatus = ScheduleStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException(
                    "Invalid status. Allowed: SCHEDULED, DELAYED, CANCELLED, COMPLETED");
        }

        schedule.setStatus(newStatus);
        FlightSchedule updated = scheduleDao.save(schedule);
        log.info("Schedule id {} status updated to {}", id, newStatus);
        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<FlightScheduleResponseDto> getAllSchedules() {
        return scheduleDao.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FlightScheduleResponseDto> getSchedulesByFlight(Long flightId) {
        return scheduleDao.findByFlightId(flightId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FlightScheduleResponseDto getScheduleById(Long id) {
        return mapToResponse(findScheduleById(id));
    }

    @Transactional(readOnly = true)
    public List<FlightScheduleResponseDto> searchFlights(FlightSearchRequestDto request) {

        Airport origin = airportDao.findByCode(request.getOriginCode().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Airport not found with code: " + request.getOriginCode()));

        Airport destination = airportDao.findByCode(request.getDestinationCode().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Airport not found with code: " + request.getDestinationCode()));

        if (origin.getId().equals(destination.getId())) {
            throw new BadRequestException("Origin and destination cannot be the same");
        }

        List<FlightSchedule> results = scheduleDao.searchSchedules(
                origin.getId(),
                destination.getId(),
                request.getJourneyDate(),
                request.getPassengers()
        );

        return results.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    private FlightSchedule findScheduleById(Long id) {
        return scheduleDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));
    }

    private Flight findFlight(Long id) {
        return flightDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id: " + id));
    }

    private String formatDuration(Integer minutes) {
        if (minutes == null) return "";
        return (minutes / 60) + "h " + (minutes % 60) + "m";
    }

    public FlightScheduleResponseDto mapToResponse(FlightSchedule fs) {
        Flight f = fs.getFlight();
        int booked = fs.getTotalSeats() - fs.getAvailableSeats();

        return FlightScheduleResponseDto.builder()
                .id(fs.getId())
                .flightId(f.getId())
                .flightNumber(f.getFlightNumber())
                .airlineName(f.getAirline().getName())
                .airlineCode(f.getAirline().getCode())
                .originAirportCode(f.getOriginAirport().getCode())
                .originCity(f.getOriginAirport().getCity())
                .destinationAirportCode(f.getDestinationAirport().getCode())
                .destinationCity(f.getDestinationAirport().getCity())
                .journeyDate(fs.getJourneyDate())
                .departureTime(fs.getDepartureTime())
                .arrivalTime(fs.getArrivalTime())
                .durationFormatted(formatDuration(f.getDurationMinutes()))
                .price(fs.getPrice())
                .totalSeats(fs.getTotalSeats())
                .availableSeats(fs.getAvailableSeats())
                .bookedSeats(booked)
                .status(fs.getStatus().name())
                .createdAt(fs.getCreatedAt())
                .updatedAt(fs.getUpdatedAt())
                .build();
    }
}