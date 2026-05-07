package com.airline.dao;

import com.airline.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackDao extends JpaRepository<Feedback, Long> {

    List<Feedback> findByBookingId(Long bookingId);

    List<Feedback> findByUserId(Long userId);

    boolean existsByBookingId(Long bookingId);
}