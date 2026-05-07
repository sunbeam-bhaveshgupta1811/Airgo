package com.airline.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatAssignmentResponse {

    private Long passengerId;

    private String passengerName;

    private String bookingReference;

    private String oldSeat;

    private String newSeat;

    private String seatZone;

    private String message;
}