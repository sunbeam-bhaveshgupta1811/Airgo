package com.airline.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FlightResponseDto {
    private Long airlineId;
    private String flightNo;
    private Long totalNoOfSeats;
}
