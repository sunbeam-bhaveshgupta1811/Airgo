package com.airline.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FlightRequestDto {
	
	private String flightNo;
    private Long airlineId; 
    private Long adminId;

    private boolean hasEconomy;
    private boolean hasBusiness;
    private boolean hasFirst;

    private Long noOfEconomySeats;
    private Long noOfBusinessSeats;
    private Long noOfFirstSeats;
}
