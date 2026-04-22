package com.airline.service;

import com.airline.dao.*;
import com.airline.dto.*;
import com.airline.entity.*;
import com.airline.exception.*;
import com.airline.request.FlightRequestDto;
import com.airline.response.FlightResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FlightServiceImpl implements FlightService {

    private final FlightDao flightDao;
    private final AirlineDao airlineDao;
    private final AirportDao airportDao;

    @Transactional
    public FlightResponseDto addFlight(FlightRequestDto request) {

        if (flightDao.existsByFlightNumber(request.getFlightNumber())) {
            throw new DuplicateResourceException(
                    "Flight already exists with number: " + request.getFlightNumber());
        }

        if (request.getOriginAirportId().equals(request.getDestinationAirportId())) {
            throw new BadRequestException("Origin and destination airports cannot be the same");
        }

        Airline airline = findAirline(request.getAirlineId());
        Airport origin = findAirport(request.getOriginAirportId());
        Airport destination = findAirport(request.getDestinationAirportId());

        Flight flight = Flight.builder()
                .flightNumber(request.getFlightNumber().toUpperCase().trim())
                .airline(airline)
                .originAirport(origin)
                .destinationAirport(destination)
                .durationMinutes(request.getDurationMinutes())
                .status(FlightStatus.ACTIVE)
                .build();

        Flight saved = flightDao.save(flight);
        log.info("Flight added: {}", saved.getFlightNumber());
        return mapToResponse(saved);
    }


    @Transactional
    public FlightResponseDto updateFlight(Long id, FlightRequestDto request) {

        Flight flight = findFlightById(id);

        if (flightDao.existsByFlightNumberAndIdNot(request.getFlightNumber(), id)) {
            throw new DuplicateResourceException(
                    "Another flight exists with number: " + request.getFlightNumber());
        }

        if (request.getOriginAirportId().equals(request.getDestinationAirportId())) {
            throw new BadRequestException("Origin and destination airports cannot be the same");
        }

        Airline airline = findAirline(request.getAirlineId());
        Airport origin = findAirport(request.getOriginAirportId());
        Airport destination = findAirport(request.getDestinationAirportId());

        flight.setFlightNumber(request.getFlightNumber().toUpperCase().trim());
        flight.setAirline(airline);
        flight.setOriginAirport(origin);
        flight.setDestinationAirport(destination);
        flight.setDurationMinutes(request.getDurationMinutes());

        Flight updated = flightDao.save(flight);
        log.info("Flight updated: {}", updated.getFlightNumber());
        return mapToResponse(updated);
    }


    @Transactional
    public ApiResponse<Void> deactivateFlight(Long id) {
        Flight flight = findFlightById(id);
        if (flight.getStatus() == FlightStatus.INACTIVE) {
            throw new BadRequestException("Flight is already inactive");
        }
        flight.setStatus(FlightStatus.INACTIVE);
        flightDao.save(flight);
        log.info("Flight deactivated: {}", flight.getFlightNumber());
        return ApiResponse.success("Flight '" + flight.getFlightNumber() + "' deactivated successfully", null);
    }

    @Transactional
    public ApiResponse<Void> reactivateFlight(Long id) {
        Flight flight = findFlightById(id);
        if (flight.getStatus() == FlightStatus.ACTIVE) {
            throw new BadRequestException("Flight is already active");
        }
        flight.setStatus(FlightStatus.ACTIVE);
        flightDao.save(flight);
        return ApiResponse.success("Flight '" + flight.getFlightNumber() + "' reactivated successfully", null);
    }

    @Transactional(readOnly = true)
    public List<FlightResponseDto> getAllFlights() {
        return flightDao.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FlightResponseDto> getActiveFlights() {
        return flightDao.findByStatus(FlightStatus.ACTIVE).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public FlightResponseDto getFlightById(Long id) {
        return mapToResponse(findFlightById(id));
    }

    @Transactional(readOnly = true)
    public List<FlightResponseDto> getFlightsByAirline(Long airlineId) {
        return flightDao.findByAirlineId(airlineId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Flight findFlightById(Long id) {
        return flightDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flight not found with id: " + id));
    }

    private Airline findAirline(Long id) {
        return airlineDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Airline not found with id: " + id));
    }

    private Airport findAirport(Long id) {
        return airportDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found with id: " + id));
    }

    private String formatDuration(Integer minutes) {
        if (minutes == null) return "";
        return (minutes / 60) + "h " + (minutes % 60) + "m";
    }

    public FlightResponseDto mapToResponse(Flight f) {
        return FlightResponseDto.builder()
                .id(f.getId())
                .flightNumber(f.getFlightNumber())
                .airlineId(f.getAirline().getId())
                .airlineName(f.getAirline().getName())
                .airlineCode(f.getAirline().getCode())
                .originAirportId(f.getOriginAirport().getId())
                .originAirportCode(f.getOriginAirport().getCode())
                .originCity(f.getOriginAirport().getCity())
                .destinationAirportId(f.getDestinationAirport().getId())
                .destinationAirportCode(f.getDestinationAirport().getCode())
                .destinationCity(f.getDestinationAirport().getCity())
                .durationMinutes(f.getDurationMinutes())
                .durationFormatted(formatDuration(f.getDurationMinutes()))
                .status(f.getStatus().name())
                .createdAt(f.getCreatedAt())
                .updatedAt(f.getUpdatedAt())
                .build();
    }
}