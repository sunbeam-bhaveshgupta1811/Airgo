package com.airline.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueTicketRequestDto {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotBlank(message = "Subject is required")
    @Size(min = 3, max = 100, message = "Subject must be between 3 and 100 characters")
    private String subject;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;
}