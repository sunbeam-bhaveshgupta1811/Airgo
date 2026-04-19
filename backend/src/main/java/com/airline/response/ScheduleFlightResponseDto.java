package com.airline.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleFlightResponseDto {
    private String source;
    private String destination;

    private LocalDateTime departure;
    private LocalDateTime arrival;

    private Long seatCostOfEconomy;
    private Long seatCostOfBusiness;
    private Long seatCostOfFirst;
}
