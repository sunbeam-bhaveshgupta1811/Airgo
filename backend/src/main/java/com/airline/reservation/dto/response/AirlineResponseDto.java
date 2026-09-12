package com.airline.reservation.dto.response;

import java.time.LocalDateTime;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AirlineResponseDto {

    private Long id;
    private String name;
    private String code;
    private String country;
    private String contactEmail;
    private String contactPhone;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}