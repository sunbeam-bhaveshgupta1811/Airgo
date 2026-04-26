package com.airline.response;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatMapResponse {

    private Long scheduleId;
    private int totalSeats;
    private int occupiedSeats;
    private int availableSeats;
    private List<SeatInfo> seats;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SeatInfo {
        private String seatNumber;
        private String zone;
        private boolean occupied;
    }
}