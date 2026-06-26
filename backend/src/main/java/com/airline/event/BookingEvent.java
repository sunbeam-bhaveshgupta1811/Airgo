package com.airline.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingEvent {
    private Long bookingId;
    private String bookingReference;
    private String eventType;  // CREATED, CANCELLED
    private Long userId;
    private String userEmail;
    private String userName;
    private String flightNumber;
    private String airlineName;
    private String originCity;
    private String destinationCity;
    private LocalDate journeyDate;
    private LocalTime departureTime;
    private int numberOfPassengers;
    private BigDecimal totalAmount;
    private LocalDateTime timestamp;
}
