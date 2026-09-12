package com.airline.reservation.service;

import com.airline.reservation.dto.request.FeedbackRequestDto;
import com.airline.reservation.dto.response.FeedbackResponseDto;

import java.util.List;

public interface FeedbackService {

    FeedbackResponseDto addFeedback(FeedbackRequestDto request);

    List<FeedbackResponseDto> getMyFeedbacks();

    List<FeedbackResponseDto> getFeedbacksByBooking(Long bookingId);

    List<FeedbackResponseDto> getAllFeedbacks();

    FeedbackResponseDto updateFeedback(Long id, FeedbackRequestDto request);

    void deleteFeedback(Long id);
}