package com.airline.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FlightRequestDto {

    @NotBlank(message = "Flight number is required")
    @Pattern(regexp = "^[A-Z0-9]{2,3}-\\d{1,4}$",
            message = "Flight number format must be like 6E-204 or AI-101")
    private String flightNumber;

    @NotNull(message = "Airline ID is required")
    private Long airlineId;

    @NotNull(message = "Origin airport ID is required")
    private Long originAirportId;

    @NotNull(message = "Destination airport ID is required")
    private Long destinationAirportId;

    @NotNull(message = "Duration is required")
    @Min(value = 30, message = "Duration must be at least 30 minutes")
    private Integer durationMinutes;
}