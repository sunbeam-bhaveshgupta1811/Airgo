package com.airline.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightStatusEvent {
    private Long scheduleId;
    private String flightNumber;
    private String airlineName;
    private String originCity;
    private String originCode;
    private String destinationCity;
    private String destinationCode;
    private LocalDate journeyDate;
    private LocalTime departureTime;
    private String oldStatus;
    private String newStatus;
    private String changedBy;  // email of admin who made the change
    private LocalDateTime timestamp;
}
