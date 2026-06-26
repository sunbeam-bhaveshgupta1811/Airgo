package com.airline.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FlightSearchRequestDto {

    @NotBlank(message = "Origin airport code is required")
    @Size(min = 3, max = 3, message = "Airport code must be 3 characters")
    private String originCode;

    @NotBlank(message = "Destination airport code is required")
    @Size(min = 3, max = 3, message = "Airport code must be 3 characters")
    private String destinationCode;

    @NotNull(message = "Journey date is required")
    @Future(message = "Journey date must be a future date")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate journeyDate;

    @NotNull(message = "Number of passengers is required")
    @Min(value = 1, message = "At least 1 passenger required")
    @Max(value = 9, message = "Maximum 9 passengers allowed per booking")
    private Integer passengers;

    // Advanced filters
    private String travelClass;       // ECONOMY, BUSINESS, FIRST_CLASS (optional)
    private BigDecimal minPrice;      // optional
    private BigDecimal maxPrice;      // optional
    private String sortBy;            // CHEAPEST, FASTEST, EARLIEST (optional, default CHEAPEST)
    private String tripType;          // ONE_WAY, ROUND_TRIP (optional, default ONE_WAY)

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate returnDate;     // required if tripType == ROUND_TRIP
}
