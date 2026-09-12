package com.airline.reservation.repository;

import com.airline.reservation.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByBookingId(Long bookingId);

    List<Feedback> findByUserId(Long userId);

    boolean existsByBookingId(Long bookingId);
}