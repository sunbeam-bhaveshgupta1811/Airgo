package com.airline.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FeedbackResponseDto {

    private Long id;
    private Long bookingId;
    private String bookingReference;

    private Long userId;
    private String userName;

    private Integer rating;
    private String comment;

    private LocalDateTime createdAt;
}