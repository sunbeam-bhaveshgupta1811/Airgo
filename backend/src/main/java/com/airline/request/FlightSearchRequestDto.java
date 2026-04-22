package com.airline.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class FlightSearchRequestDto {

    @NotBlank(message = "Origin airport code is required")
    @Size(min = 3, max = 3, message = "Airport code must be 3 characters")
    private String originCode;       // DEL

    @NotBlank(message = "Destination airport code is required")
    @Size(min = 3, max = 3, message = "Airport code must be 3 characters")
    private String destinationCode;  // BOM

    @NotNull(message = "Journey date is required")
    @Future(message = "Journey date must be a future date")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate journeyDate;

    @NotNull(message = "Number of passengers is required")
    @Min(value = 1, message = "At least 1 passenger required")
    @Max(value = 9, message = "Maximum 9 passengers allowed per booking")
    private Integer passengers;
}