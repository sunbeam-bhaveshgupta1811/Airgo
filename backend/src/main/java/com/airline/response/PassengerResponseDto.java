package com.airline.response;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PassengerResponseDto {

    private Long id;
    private Long bookingId;
    private String bookingReference;

    private String firstName;
    private String lastName;
    private String fullName;

    private String gender;
    private LocalDate dateOfBirth;

    private String idType;
    private String idNumber;

    private String seatNumber;
    private String seatZone;

    private LocalDateTime createdAt;
}