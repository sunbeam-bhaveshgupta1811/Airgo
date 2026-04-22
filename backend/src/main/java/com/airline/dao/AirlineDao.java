package com.airline.dao;


import com.airline.entity.Airline;
import com.airline.entity.AirlineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AirlineDao extends JpaRepository<Airline, Long> {

	boolean existsByName(String name);
	boolean existsByCode(String code);

	boolean existsByNameAndIdNot(String name, Long id);
	boolean existsByCodeAndIdNot(String code, Long id);

	List<Airline> findByStatus(AirlineStatus status);

	Optional<Airline> findByCode(String code);
}