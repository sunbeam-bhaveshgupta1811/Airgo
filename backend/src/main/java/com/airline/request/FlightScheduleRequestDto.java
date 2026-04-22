package com.airline.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class FlightScheduleRequestDto {

    @NotNull(message = "Flight ID is required")
    private Long flightId;

    @NotNull(message = "Journey date is required")
    @Future(message = "Journey date must be a future date")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate journeyDate;

    @NotNull(message = "Departure time is required")
    @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
    private LocalTime departureTime;

    @NotNull(message = "Arrival time is required")
    @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
    private LocalTime arrivalTime;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Invalid price format")
    private BigDecimal price;

    @NotNull(message = "Total seats is required")
    @Min(value = 1, message = "Total seats must be at least 1")
    @Max(value = 853, message = "Total seats cannot exceed 853")
    private Integer totalSeats;

}