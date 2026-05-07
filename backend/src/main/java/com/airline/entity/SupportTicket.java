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

    @ManyToOne
    private User user;

    @ManyToOne
    private Booking booking;

    private String adminResponse;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}