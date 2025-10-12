package com.sunbeam.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sunbeam.entities.User;



@Repository
public interface UserDao extends JpaRepository<User, Long>{
	Optional<User> findByEmail(String email);
	boolean existsByEmail(String email);
	Optional<User> findByVerificationToken(String token);
//	Optional<ScheduleFlight> findBySourceAndDestinationAndDeparture(String source,String destination,String departure);
}
