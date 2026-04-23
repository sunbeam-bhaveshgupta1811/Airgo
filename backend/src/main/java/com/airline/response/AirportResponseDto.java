package com.airline.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AirportResponseDto {

    private Long id;
    private String code;
    private String name;
    private String city;
    private String country;
    private String timezone;
    private boolean active;
    private LocalDateTime createdAt;
}