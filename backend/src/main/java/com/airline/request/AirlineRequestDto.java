package com.airline.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AirlineRequestDto {

    @NotBlank(message = "Airline name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "IATA code is required")
    @Size(min = 2, max = 3, message = "IATA code must be 2 or 3 characters")
    @Pattern(regexp = "^[A-Z0-9]{2,3}$", message = "IATA code must be uppercase letters/digits only (e.g. 6E, AI, IndiGo = 6E)")
    private String code;

    @NotBlank(message = "Country is required")
    private String country;

    @Email(message = "Please provide a valid contact email")
    private String contactEmail;

    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Please provide a valid phone number")
    private String contactPhone;
}