package com.airline.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_notification_user", columnList = "user_id"),
    @Index(name = "idx_notification_type", columnList = "type")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String type;  // FLIGHT_DELAYED, FLIGHT_CANCELLED, BOOKING_CONFIRMED, BOOKING_CANCELLED, PAYMENT_SUCCESS, PAYMENT_FAILED, PAYMENT_REFUNDED

    @Column(nullable = false, length = 500)
    private String message;

    @Column(nullable = false, length = 20)
    private String channel;  // EMAIL, SMS, PUSH

    @Column(nullable = false)
    private boolean sent = false;

    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    private String referenceId;  // bookingRef or scheduleId

    private LocalDateTime sentAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
