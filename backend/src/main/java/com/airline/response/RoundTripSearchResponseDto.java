package com.airline.response;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoundTripSearchResponseDto {
    private List<FlightScheduleResponseDto> outboundFlights;
    private List<FlightScheduleResponseDto> returnFlights;
}
