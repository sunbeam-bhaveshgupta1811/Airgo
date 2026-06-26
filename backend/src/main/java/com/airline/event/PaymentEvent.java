package com.airline.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEvent {
    private Long paymentId;
    private String transactionId;
    private Long bookingId;
    private String bookingReference;
    private String eventType;  // SUCCESS, FAILED, REFUNDED
    private String userEmail;
    private String userName;
    private String flightNumber;
    private BigDecimal amount;
    private String paymentMethod;
    private String failureReason;
    private LocalDateTime timestamp;
}
