package com.airline.service;
import com.airline.dao.AirportDao;
import com.airline.dto.ApiResponse;
import com.airline.entity.Airport;
import com.airline.exception.BadRequestException;
import com.airline.exception.DuplicateResourceException;
import com.airline.exception.ResourceNotFoundException;
import com.airline.request.AirportRequestDto;
import com.airline.response.AirportResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class AirportServiceImpl implements AirportService{

    private final AirportDao airportDao;

    @Transactional
    public AirportResponseDto addAirport(AirportRequestDto request) {

        if (airportDao.existsByCode(request.getCode().toUpperCase())) {
            throw new DuplicateResourceException(
                    "Airport already exists with code: " + request.getCode());
        }

        Airport airport = Airport.builder()
                .code(request.getCode().toUpperCase().trim())
                .name(request.getName().trim())
                .city(request.getCity().trim())
                .country(request.getCountry().trim())
                .timezone(request.getTimezone())
                .active(true)
                .build();

        Airport saved = airportDao.save(airport);
        log.info("Airport added: {} - {}", saved.getCode(), saved.getName());
        return mapToResponse(saved);
    }

    @Transactional
    public AirportResponseDto updateAirport(Long id, AirportRequestDto request) {

        Airport airport = findById(id);

        if (airportDao.existsByCodeAndIdNot(request.getCode().toUpperCase(), id)) {
            throw new DuplicateResourceException(
                    "Another airport already exists with code: " + request.getCode());
        }

        airport.setCode(request.getCode().toUpperCase().trim());
        airport.setName(request.getName().trim());
        airport.setCity(request.getCity().trim());
        airport.setCountry(request.getCountry().trim());
        airport.setTimezone(request.getTimezone());

        Airport updated = airportDao.save(airport);
        log.info("Airport updated: {}", updated.getCode());
        return mapToResponse(updated);
    }


    @Transactional
    public ApiResponse<Void> deactivateAirport(Long id) {
        Airport airport = findById(id);
        if (!airport.isActive()) {
            throw new BadRequestException("Airport is already inactive");
        }
        airport.setActive(false);
        airportDao.save(airport);
        log.info("Airport deactivated: {}", airport.getCode());
        return ApiResponse.success("Airport '" + airport.getCode() + "' deactivated successfully", null);
    }

    @Transactional
    public ApiResponse<Void> reactivateAirport(Long id) {
        Airport airport = findById(id);
        if (airport.isActive()) {
            throw new BadRequestException("Airport is already active");
        }
        airport.setActive(true);
        airportDao.save(airport);
        return ApiResponse.success("Airport '" + airport.getCode() + "' reactivated successfully", null);
    }



    @Transactional(readOnly = true)
    public List<AirportResponseDto> getAllAirports() {
        return airportDao.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AirportResponseDto> getActiveAirports() {
        return airportDao.findByActive(true).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AirportResponseDto getAirportById(Long id) {
        return mapToResponse(findById(id));
    }

    public Airport findById(Long id) {
        return airportDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found with id: " + id));
    }

    public Airport findByCode(String code) {
        return airportDao.findByCode(code.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found with code: " + code));
    }



    private AirportResponseDto mapToResponse(Airport airport) {
        return AirportResponseDto.builder()
                .id(airport.getId())
                .code(airport.getCode())
                .name(airport.getName())
                .city(airport.getCity())
                .country(airport.getCountry())
                .timezone(airport.getTimezone())
                .active(airport.isActive())
                .build();
    }

}
