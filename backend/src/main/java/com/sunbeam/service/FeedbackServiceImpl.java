package com.sunbeam.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sunbeam.dao.BookingDao;
import com.sunbeam.dao.FeedbackDao;
import com.sunbeam.dao.UserDao;
import com.sunbeam.dto.FeedbackDto;
import com.sunbeam.entities.Booking;
import com.sunbeam.entities.Feedback;
import com.sunbeam.entities.User;
import com.sunbeam.exception.ResourceNotFoundException;
import com.sunbeam.request.UserFeedbackRequestDto;
import com.sunbeam.response.ApiResponse;

@Service
public class FeedbackServiceImpl implements FeedbackService{

	@Autowired
    private FeedbackDao feedbackDao;
	
	@Autowired
	private BookingDao bookingDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
    private ModelMapper modelMapper;
	
	@Override
	public ApiResponse<String> addFeedback(UserFeedbackRequestDto dto) {
		
		Booking booking = bookingDao.findById(dto.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + dto.getBookingId()));
		
		User user = userDao.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));

		
		Feedback feedback = new Feedback();
		feedback.setBooking(booking);
        feedback.setUser(user);
        feedback.setRating(dto.getRating());
        feedback.setComments(dto.getComments());
        feedback.setSubmittedAt(LocalDateTime.now());
        feedbackDao.save(feedback);

        return new ApiResponse<>(true, "Feedback submitted successfully", null);
	}

	@Override
	public ApiResponse<List<FeedbackDto>> getFeedbackByUserId(Long userId) {
		List<Feedback> feedbacks = feedbackDao.findByUserId(userId);
		
		List<FeedbackDto> feedbackDto = new ArrayList<>();

        if (feedbacks.isEmpty()) {
            return new ApiResponse<>(true, "No feedbacks found for this user", List.of());
        }
        for(Feedback feedback : feedbacks) {
        	FeedbackDto feedbackdto = modelMapper.map(feedback, FeedbackDto.class);
        	feedbackdto.setBookingId(feedback.getBooking().getBookingId());
        	feedbackdto.setFlightName(feedback.getBooking().getFlightNumber());
        	feedbackdto.setUserId(feedback.getUser().getId());
        	feedbackDto.add(feedbackdto);
        }
        return new ApiResponse<>(true, "Feedback fetched successfully",feedbackDto);
	}

}
