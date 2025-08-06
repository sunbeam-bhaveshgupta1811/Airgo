package com.sunbeam.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.sunbeam.entities.Booking;

@Repository
public interface AdminBookingDao extends JpaRepository<Booking, Long>{
<<<<<<< Updated upstream
	@Query("select sum(totalAmount) from Booking")
=======
	@Query("SELECT SUM(b.totalFare) FROM Booking b")
>>>>>>> Stashed changes
	long getTotalAmountBookingPassenger();
}
