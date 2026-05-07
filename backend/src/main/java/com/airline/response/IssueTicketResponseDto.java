package com.airline.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class IssueTicketResponseDto {

    private Long id;
    private String subject;
    private String description;

    private String status;

    private String userName;
    private String bookingReference;

    private String adminResponse;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}