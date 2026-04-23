package com.airline.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AirportRequestDto {

    @NotBlank(message = "Airport code is required")
    @Size(min = 3, max = 3, message = "IATA code must be exactly 3 characters")
    @Pattern(regexp = "^[A-Z]{3}$", message = "IATA code must be 3 uppercase letters (e.g. DEL, BOM)")
    private String code;

    @NotBlank(message = "Airport name is required")
    private String name;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Country is required")
    private String country;

    private String timezone;
}