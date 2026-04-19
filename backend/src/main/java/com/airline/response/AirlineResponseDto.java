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
public class AirlineResponseDto {
    private String airlineName;
    private int noOfFlights;
    private LocalDateTime date;
}
