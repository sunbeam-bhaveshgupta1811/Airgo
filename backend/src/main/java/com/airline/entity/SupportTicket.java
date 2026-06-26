package com.airline.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "support_tickets")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SupportTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subject;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private IssueTicket status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    private String adminResponse;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}