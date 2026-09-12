package com.airline.reservation.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightResponseDto {

    private Long id;
    private String flightNumber;
    private Long airlineId;
    private String airlineName;
    private String airlineCode;
    private Long originAirportId;
    private String originAirportCode;
    private String originCity;
    private Long destinationAirportId;
    private String destinationAirportCode;
    private String destinationCity;
    private Integer durationMinutes;
    private String durationFormatted;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}