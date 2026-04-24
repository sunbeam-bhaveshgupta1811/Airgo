package com.airline.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {

    private Long id;
    private String transactionId;
    private Long bookingId;
    private String bookingReference;
    private BigDecimal amount;
    private String paymentMethod;
    private String status;
    private String failureReason;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
}