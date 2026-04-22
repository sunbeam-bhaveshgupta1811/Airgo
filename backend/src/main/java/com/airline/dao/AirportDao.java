package com.airline.dao;

import com.airline.entity.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AirportDao extends JpaRepository<Airport, Long> {

    boolean existsByCode(String code);
    boolean existsByCodeAndIdNot(String code, Long id);

    Optional<Airport> findByCode(String code);

    List<Airport> findByActive(boolean active);

    List<Airport> findByCity(String city);
}