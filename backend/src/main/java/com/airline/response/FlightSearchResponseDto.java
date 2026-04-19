package com.airline.response;

import java.sql.Date;
import java.sql.Time;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FlightSearchResponseDto {
    private Long flightId;
    private String flightNo;
    private String airlineName;

    private String fromLocation;
    private String toLocation;

    private Date departureDate;
    private Date arrivalDate;
    private Time departureTime;
    private Time arrivalTime;

    private Long economyFare;
    private Long businessFare;
    private Long firstFare;

    private Long availableEconomySeats;
    private Long availableBusinessSeats;
    private Long availableFirstSeats;
    
    public FlightSearchResponseDto(Long flightId, String flightNo, String airlineName,
            String fromLocation, String toLocation,
            Date departureDate, Date arrivalDate,
            Time departureTime, Time arrivalTime,
            Long economyFare, Long businessFare, Long firstFare,
            Long availableEconomySeats, Long availableBusinessSeats, Long availableFirstSeats) {
this.flightId = flightId;
this.flightNo = flightNo;
this.airlineName = airlineName;
this.fromLocation = fromLocation;
this.toLocation = toLocation;
this.departureDate = departureDate;
this.arrivalDate = arrivalDate;
this.departureTime = departureTime;
this.arrivalTime = arrivalTime;
this.economyFare = economyFare;
this.businessFare = businessFare;
this.firstFare = firstFare;
this.availableEconomySeats = availableEconomySeats;
this.availableBusinessSeats = availableBusinessSeats;
this.availableFirstSeats = availableFirstSeats;
}

}
