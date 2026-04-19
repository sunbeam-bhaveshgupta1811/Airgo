package com.airline.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AirlineRequestDto {
    private String airlineName;
    private int noOfFlights;
    private Long adminId;
}
