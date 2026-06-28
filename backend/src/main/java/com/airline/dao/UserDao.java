package com.airline.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.airline.entity.ApprovalStatus;
import com.airline.entity.Role;
import com.airline.entity.User;



@Repository
public interface UserDao extends JpaRepository<User, Long>{
	Optional<User> findByEmail(String email);
	boolean existsByEmail(String email);
	boolean existsByPhone(String phone);
	Optional<User> findByVerificationToken(String token);
	Optional<User> findByResetPasswordToken(String token);
	boolean existsByRole(Role role);
	List<User> findByRole(Role role);
	List<User> findByRoleAndApprovalStatus(Role role, ApprovalStatus approvalStatus);
	long countByRole(Role role);


//	Optional<ScheduleFlight> findBySourceAndDestinationAndDeparture(String source,String destination,String departure);
}
