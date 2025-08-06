package com.sunbeam.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponseDTO {
    private String userName;
    private long bookingId;
    private String flightName;
    private Integer rating;
    private String comments;
    private LocalDateTime submittedAt;

}

