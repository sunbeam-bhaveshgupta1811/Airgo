package com.airline.reservation.service;

import com.airline.reservation.repository.AirlineRepository;
import com.airline.reservation.dto.ApiResponse;
import com.airline.reservation.entity.Airline;
import com.airline.reservation.entity.AirlineStatus;
import com.airline.reservation.exception.BadRequestException;
import com.airline.reservation.exception.DuplicateResourceException;
import com.airline.reservation.exception.ResourceNotFoundException;
import com.airline.reservation.dto.request.AirlineRequestDto;
import com.airline.reservation.dto.response.AirlineResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class AirlineServiceImpl implements AirlineService {

    private final AirlineRepository airlineRepository;

    @Override
    public AirlineResponseDto addAirline(AirlineRequestDto request) {
        if (airlineRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                    "Airline already exists with name: " + request.getName());
        }
        if (airlineRepository.existsByCode(request.getCode().toUpperCase())) {
            throw new DuplicateResourceException(
                    "Airline already exists with IATA code: " + request.getCode());
        }
        Airline airline = Airline.builder()
                .name(request.getName().trim())
                .code(request.getCode().toUpperCase().trim())
                .country(request.getCountry().trim())
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .status(AirlineStatus.ACTIVE)
                .build();
        Airline saved = airlineRepository.save(airline);
        log.info("Airline added: {} ({})", saved.getName(), saved.getCode());
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AirlineResponseDto> getActiveAirlines() {
        return airlineRepository.findByStatus(AirlineStatus.ACTIVE)
                .stream()
                .map(e->mapToResponse(e))
                .collect(Collectors.toList());
    }

    @Transactional
    public AirlineResponseDto updateAirline(Long id, AirlineRequestDto request) {

        Airline airline = findAirlineById(id);

        if (airlineRepository.existsByNameAndIdNot(request.getName(), id)) {
            throw new DuplicateResourceException(
                    "Another airline already exists with name: " + request.getName());
        }

        if (airlineRepository.existsByCodeAndIdNot(request.getCode().toUpperCase(), id)) {
            throw new DuplicateResourceException(
                    "Another airline already exists with IATA code: " + request.getCode());
        }

        airline.setName(request.getName().trim());
        airline.setCode(request.getCode().toUpperCase().trim());
        airline.setCountry(request.getCountry().trim());
        airline.setContactEmail(request.getContactEmail());
        airline.setContactPhone(request.getContactPhone());

        Airline updated = airlineRepository.save(airline);
        log.info("Airline updated: {} ({})", updated.getName(), updated.getCode());

        return mapToResponse(updated);
    }


    @Transactional
    public ApiResponse<Void> deactivateAirline(Long id) {

        Airline airline = findAirlineById(id);

        if (airline.getStatus() == AirlineStatus.INACTIVE) {
            throw new BadRequestException("Airline is already inactive");
        }

        airline.setStatus(AirlineStatus.INACTIVE);
        airlineRepository.save(airline);
        log.info("Airline deactivated: {} ({})", airline.getName(), airline.getCode());

        return ApiResponse.success(
                "Airline '" + airline.getName() + "' has been deactivated successfully", null);
    }

    @Transactional
    public ApiResponse<Void> reactivateAirline(Long id) {

        Airline airline = findAirlineById(id);

        if (airline.getStatus() == AirlineStatus.ACTIVE) {
            throw new BadRequestException("Airline is already active");
        }

        airline.setStatus(AirlineStatus.ACTIVE);
        airlineRepository.save(airline);
        log.info("Airline reactivated: {} ({})", airline.getName(), airline.getCode());

        return ApiResponse.success(
                "Airline '" + airline.getName() + "' has been reactivated successfully", null);
    }

    @Transactional(readOnly = true)
    public List<AirlineResponseDto> getAllAirlines() {
        return airlineRepository.findByStatus(AirlineStatus.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public AirlineResponseDto getAirlineById(Long id) {
        return mapToResponse(findAirlineById(id));
    }

    private Airline findAirlineById(Long id) {
        return airlineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Airline not found with id: " + id));
    }

    private AirlineResponseDto mapToResponse(Airline airline) {
        return AirlineResponseDto.builder()
                .id(airline.getId())
                .name(airline.getName())
                .code(airline.getCode())
                .country(airline.getCountry())
                .contactEmail(airline.getContactEmail())
                .contactPhone(airline.getContactPhone())
                .status(airline.getStatus().name())
                .createdAt(airline.getCreatedAt())
                .updatedAt(airline.getUpdatedAt())
                .build();
    }
}
