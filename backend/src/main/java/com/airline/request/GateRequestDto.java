package com.airline.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GateRequestDto {

    @NotBlank(message = "Gate number is required")
    private String gateNumber;

    @NotNull(message = "Terminal ID is required")
    private Long terminalId;

    private String status;  // AVAILABLE, OCCUPIED, MAINTENANCE
}
