package com.airline.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "flight_events", indexes = {
    @Index(name = "idx_flight_event_schedule", columnList = "schedule_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    private FlightSchedule flightSchedule;

    @Column(nullable = false, length = 20)
    private String oldStatus;

    @Column(nullable = false, length = 20)
    private String newStatus;

    @Column(nullable = false)
    private String changedBy;  // admin email

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
