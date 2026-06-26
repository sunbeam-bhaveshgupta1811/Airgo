package com.airline.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GateResponseDto {
    private Long id;
    private String gateNumber;
    private Long terminalId;
    private String terminalCode;
    private String terminalName;
    private Long airportId;
    private String airportCode;
    private String status;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
