package com.airline.service;

import com.airline.dao.*;
import com.airline.entity.*;
import com.airline.exception.*;
import com.airline.request.FeedbackRequestDto;
import com.airline.response.FeedbackResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackDao feedbackDao;
    private final BookingDao bookingDao;
    private final UserDao userDao;

    @Override
    public FeedbackResponseDto addFeedback(FeedbackRequestDto request) {

        User user = getLoggedInUser();

        Booking booking = bookingDao.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // ✅ Ownership check
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Not your booking");
        }

        // ✅ Only after completed journey
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Feedback allowed only after journey completion");
        }

        // ✅ One feedback per booking
        if (feedbackDao.existsByBookingId(booking.getId())) {
            throw new DuplicateResourceException("Feedback already submitted");
        }

        Feedback feedback = Feedback.builder()
                .booking(booking)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComments())
                .createdAt(LocalDateTime.now())
                .build();

        return mapToResponse(feedbackDao.save(feedback));
    }

    @Override
    public List<FeedbackResponseDto> getMyFeedbacks() {
        User user = getLoggedInUser();
        return feedbackDao.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<FeedbackResponseDto> getFeedbacksByBooking(Long bookingId) {

        User user = getLoggedInUser();

        Booking booking = bookingDao.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // ✅ SECURITY FIX
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to this booking");
        }

        return feedbackDao.findByBookingId(bookingId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<FeedbackResponseDto> getAllFeedbacks() {
        return feedbackDao.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public FeedbackResponseDto updateFeedback(Long id, FeedbackRequestDto request) {

        User user = getLoggedInUser();

        Feedback feedback = feedbackDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));

        // ✅ Ownership check
        if (!feedback.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized");
        }

        feedback.setRating(request.getRating());
        feedback.setComment(request.getComments());

        return mapToResponse(feedbackDao.save(feedback));
    }

    @Override
    public void deleteFeedback(Long id) {

        User user = getLoggedInUser();

        Feedback feedback = feedbackDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));

        // ✅ Ownership check
        if (!feedback.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized");
        }

        feedbackDao.delete(feedback);
    }

    private User getLoggedInUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userDao.findByEmail(email)
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