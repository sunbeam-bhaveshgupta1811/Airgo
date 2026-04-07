package com.sunbeam.service;

import java.util.List;

import com.sunbeam.dto.FeedbackDto;
import com.sunbeam.request.UserFeedbackRequestDto;
import com.sunbeam.response.ApiResponse;

public interface FeedbackService {
    ApiResponse<String> addFeedback(UserFeedbackRequestDto dto);
    ApiResponse<List<FeedbackDto>> getFeedbackByUserId(Long userId);
}