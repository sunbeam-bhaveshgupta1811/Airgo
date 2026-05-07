package com.airline.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PassengerRequestDto {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50)
    private String lastName;

    @NotBlank(message = "Gender is required")
    private String gender;              // MALE / FEMALE / OTHER

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "ID type is required")
    private String idType;             // PASSPORT / AADHAAR / PAN

    @NotBlank(message = "ID number is required")
    private String idNumber;
}