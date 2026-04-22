package com.airline.service;

import com.airline.dao.AirlineDao;
import com.airline.dto.ApiResponse;
import com.airline.entity.Airline;
import com.airline.entity.AirlineStatus;
import com.airline.exception.BadRequestException;
import com.airline.exception.DuplicateResourceException;
import com.airline.exception.ResourceNotFoundException;
import com.airline.request.AirlineRequestDto;
import com.airline.response.AirlineResponseDto;
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

    private final AirlineDao airlineDao;

    @Override
    public AirlineResponseDto addAirline(AirlineRequestDto request) {
        if (airlineDao.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                    "Airline already exists with name: " + request.getName());
        }
        if (airlineDao.existsByCode(request.getCode().toUpperCase())) {
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
        Airline saved = airlineDao.save(airline);
        log.info("Airline added: {} ({})", saved.getName(), saved.getCode());
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AirlineResponseDto> getActiveAirlines() {
        return airlineDao.findByStatus(AirlineStatus.ACTIVE)
                .stream()
                .map(e->mapToResponse(e))
                .collect(Collectors.toList());
    }

    @Transactional
    public AirlineResponseDto updateAirline(Long id, AirlineRequestDto request) {

        Airline airline = findAirlineById(id);

        if (airlineDao.existsByNameAndIdNot(request.getName(), id)) {
            throw new DuplicateResourceException(
                    "Another airline already exists with name: " + request.getName());
        }

        if (airlineDao.existsByCodeAndIdNot(request.getCode().toUpperCase(), id)) {
            throw new DuplicateResourceException(
                    "Another airline already exists with IATA code: " + request.getCode());
        }

        airline.setName(request.getName().trim());
        airline.setCode(request.getCode().toUpperCase().trim());
        airline.setCountry(request.getCountry().trim());
        airline.setContactEmail(request.getContactEmail());
        airline.setContactPhone(request.getContactPhone());

        Airline updated = airlineDao.save(airline);
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
        airlineDao.save(airline);
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
        airlineDao.save(airline);
        log.info("Airline reactivated: {} ({})", airline.getName(), airline.getCode());

        return ApiResponse.success(
                "Airline '" + airline.getName() + "' has been reactivated successfully", null);
    }

    @Transactional(readOnly = true)
    public List<AirlineResponseDto> getAllAirlines() {
        return airlineDao.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public AirlineResponseDto getAirlineById(Long id) {
        return mapToResponse(findAirlineById(id));
    }

    private Airline findAirlineById(Long id) {
        return airlineDao.findById(id)
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
