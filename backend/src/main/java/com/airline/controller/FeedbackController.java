package com.airline.controller;

import com.airline.request.FeedbackRequestDto;
import com.airline.response.FeedbackResponseDto;
import com.airline.service.FeedbackService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/user/feedback")
    public FeedbackResponseDto addFeedback(@Valid @RequestBody FeedbackRequestDto request) {
        return feedbackService.addFeedback(request);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user/feedback/my")
    public List<FeedbackResponseDto> getMyFeedbacks() {
        return feedbackService.getMyFeedbacks();
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user/feedback/booking/{bookingId}")
    public List<FeedbackResponseDto> getByBooking(@PathVariable Long bookingId) {
        return feedbackService.getFeedbacksByBooking(bookingId);
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/user/feedback/{id}")
    public FeedbackResponseDto update(@PathVariable Long id,
                                      @Valid @RequestBody FeedbackRequestDto request) {
        return feedbackService.updateFeedback(id, request);
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/user/feedback/{id}")
    public String delete(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return "Feedback deleted successfully";
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/feedback")
    public List<FeedbackResponseDto> getAll() {
        return feedbackService.getAllFeedbacks();
    }
}