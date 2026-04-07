package com.sunbeam.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sunbeam.entities.Feedback;



@Repository
public interface FeedbackDao extends JpaRepository<Feedback, Long>{
	List<Feedback> findByUserId(Long userId);
}
