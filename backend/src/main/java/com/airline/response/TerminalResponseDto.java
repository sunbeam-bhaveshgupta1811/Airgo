package com.airline.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TerminalResponseDto {
    private Long id;
    private String terminalCode;
    private String name;
    private Long airportId;
    private String airportCode;
    private String airportName;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
