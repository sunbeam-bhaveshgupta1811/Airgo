package com.airline.request;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleFlightRequestDto {
	
	private Long flightId;
    private Long adminId;
	
    private String source;
    private String destination;

    private LocalDateTime departure;
    private LocalDateTime arrival;

    private Long seatCostOfEconomy;
    private Long seatCostOfBusiness;
    private Long seatCostOfFirst;
}
