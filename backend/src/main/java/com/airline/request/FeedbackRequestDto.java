package com.airline.request;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackRequestDto {
	
	private Long bookingId;
    private String flightName;
    private Integer rating;
    private String comments;
    private LocalDateTime submittedAt;
    private Long userId;

}
