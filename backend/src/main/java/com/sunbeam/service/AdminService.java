package com.sunbeam.service;

import java.util.List;
import java.util.Optional;

import com.sunbeam.dto.AirlineDTO;
import com.sunbeam.entities.AirlineDetail;
import com.sunbeam.entities.Feedback;
import com.sunbeam.entities.User;


public interface AdminService {
	long getTotalAirlinesCount();
	long getTotalFlightsCount();
	long getTotalBooking();
<<<<<<< Updated upstream
	long getTotalAmountBooking();
	List<AirlineDetail> getAllAirlines();
AirlineDetail addAirline(AirlineDTO airlineDTO);
	List<Feedback> getAllFeedback();
	User getProfileData(String email);
=======
	Long getTotalAmountBooking();
	List<AirlineDetail> getAllAirlines();
	List<FeedbackResponseDTO> getAllFeedback();
>>>>>>> Stashed changes
}
