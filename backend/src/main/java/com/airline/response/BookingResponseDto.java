package com.airline.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDto {

    private Long id;
    private String bookingReference;

    private Long userId;
    private String userName;

    private Long scheduleId;
    private String flightNumber;
    private String airlineName;
    private String originCode;
    private String originCity;
    private String destinationCode;
    private String destinationCity;
    private LocalDate journeyDate;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private String durationFormatted;

    private Integer numberOfPassengers;
    private BigDecimal pricePerPassenger;
    private BigDecimal totalAmount;
    private String status;

    private List<PassengerResponseDto> passengers;
    private PaymentResponseDto payment;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}