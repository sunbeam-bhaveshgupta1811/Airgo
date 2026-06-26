package com.airline.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TerminalRequestDto {

    @NotBlank(message = "Terminal code is required")
    private String terminalCode;

    @NotBlank(message = "Terminal name is required")
    private String name;

    @NotNull(message = "Airport ID is required")
    private Long airportId;
}
