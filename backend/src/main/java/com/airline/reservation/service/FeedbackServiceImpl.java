package com.airline.reservation.service;

import com.airline.reservation.repository.*;
import com.airline.reservation.entity.*;
import com.airline.reservation.exception.*;
import com.airline.reservation.dto.request.FeedbackRequestDto;
import com.airline.reservation.dto.response.FeedbackResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Override
    public FeedbackResponseDto addFeedback(FeedbackRequestDto request) {

        User user = getLoggedInUser();

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // ✅ Ownership check
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not authorized to review this booking");
        }

        // ✅ Only after completed journey
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Feedback allowed only after journey completion");
        }

        // ✅ One feedback per booking
        if (feedbackRepository.existsByBookingId(booking.getId())) {
            throw new DuplicateResourceException("Feedback already submitted");
        }

        Feedback feedback = Feedback.builder()
                .booking(booking)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComments())
                .createdAt(LocalDateTime.now())
                .build();

        return mapToResponse(feedbackRepository.save(feedback));
    }

    @Override
    public List<FeedbackResponseDto> getMyFeedbacks() {
        User user = getLoggedInUser();
        return feedbackRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<FeedbackResponseDto> getFeedbacksByBooking(Long bookingId) {

        User user = getLoggedInUser();

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // ✅ SECURITY FIX
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not authorized to view this booking");
        }

        return feedbackRepository.findByBookingId(bookingId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<FeedbackResponseDto> getAllFeedbacks() {
        return feedbackRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public FeedbackResponseDto updateFeedback(Long id, FeedbackRequestDto request) {

        User user = getLoggedInUser();

        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));

        // ✅ Ownership check
        if (!feedback.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not authorized to modify this feedback");
        }

        feedback.setRating(request.getRating());
        feedback.setComment(request.getComments());

        return mapToResponse(feedbackRepository.save(feedback));
    }

    @Override
    public void deleteFeedback(Long id) {

        User user = getLoggedInUser();

        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));

        // ✅ Ownership check
        if (!feedback.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not authorized to modify this feedback");
        }

        feedbackRepository.delete(feedback);
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private FeedbackResponseDto mapToResponse(Feedback f) {
        return FeedbackResponseDto.builder()
                .id(f.getId())
                .bookingId(f.getBooking().getId())
                .bookingReference(f.getBooking().getBookingReference())
                .userId(f.getUser().getId())
                .userName(f.getUser().getFirstName() + " " + f.getUser().getLastName())
                .rating(f.getRating())
                .comment(f.getComment())
                .createdAt(f.getCreatedAt())
                .build();
    }
}