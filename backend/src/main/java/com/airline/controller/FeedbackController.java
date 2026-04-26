package com.airline.controller;

import com.airline.request.FeedbackRequestDto;
import com.airline.response.FeedbackResponseDto;
import com.airline.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    public FeedbackResponseDto addFeedback(@RequestBody FeedbackRequestDto request) {
        return feedbackService.addFeedback(request);
    }

    @GetMapping("/my")
    public List<FeedbackResponseDto> getMyFeedbacks() {
        return feedbackService.getMyFeedbacks();
    }

    @GetMapping("/booking/{bookingId}")
    public List<FeedbackResponseDto> getByBooking(@PathVariable Long bookingId) {
        return feedbackService.getFeedbacksByBooking(bookingId);
    }

    @GetMapping
    public List<FeedbackResponseDto> getAll() {
        return feedbackService.getAllFeedbacks();
    }

    @PutMapping("/{id}")
    public FeedbackResponseDto update(@PathVariable Long id,
                                      @RequestBody FeedbackRequestDto request) {
        return feedbackService.updateFeedback(id, request);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return "Feedback deleted successfully";
    }
}