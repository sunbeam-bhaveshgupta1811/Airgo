package com.airline.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightScheduleResponseDto {

    private Long id;
    private Long flightId;
    private String flightNumber;
    private String airlineName;
    private String airlineCode;
    private String originAirportCode;
    private String originCity;
    private String destinationAirportCode;
    private String destinationCity;
    private LocalDate journeyDate;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private String durationFormatted;
    private BigDecimal price;
    private Integer totalSeats;
    private Integer availableSeats;
    private Integer bookedSeats;
    private String status;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}