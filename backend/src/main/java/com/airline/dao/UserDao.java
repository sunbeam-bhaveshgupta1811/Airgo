package com.airline.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.airline.entity.User;



@Repository
public interface UserDao extends JpaRepository<User, Long>{
	Optional<User> findByEmail(String email);
	boolean existsByEmail(String email);
	boolean existsByPhone(String phone);
	Optional<User> findByVerificationToken(String token);
	Optional<User> findByResetPasswordToken(String token);


//	Optional<ScheduleFlight> findBySourceAndDestinationAndDeparture(String source,String destination,String departure);
}
