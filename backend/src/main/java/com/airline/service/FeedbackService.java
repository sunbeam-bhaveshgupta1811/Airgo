package com.airline.service;

import com.airline.request.FeedbackRequestDto;
import com.airline.response.FeedbackResponseDto;

import java.util.List;

public interface FeedbackService {

    FeedbackResponseDto addFeedback(FeedbackRequestDto request);

    List<FeedbackResponseDto> getMyFeedbacks();

    List<FeedbackResponseDto> getFeedbacksByBooking(Long bookingId);

    List<FeedbackResponseDto> getAllFeedbacks();

    FeedbackResponseDto updateFeedback(Long id, FeedbackRequestDto request);

    void deleteFeedback(Long id);
}