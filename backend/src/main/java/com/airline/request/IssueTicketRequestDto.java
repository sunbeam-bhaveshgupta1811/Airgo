package com.airline.request;

import lombok.Data;

@Data
public class IssueTicketRequestDto {

    private Long bookingId;
    private String subject;
    private String description;
}