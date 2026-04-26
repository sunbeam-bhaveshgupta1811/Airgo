package com.airline.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BookingRequestDto {

    @NotNull(message = "Schedule ID is required")
    private Long scheduleId;

    @NotNull(message = "Number of passengers is required")
    @Min(value = 1, message = "At least 1 passenger required")
    @Max(value = 9, message = "Maximum 9 passengers per booking")
    private Integer numberOfPassengers;
}