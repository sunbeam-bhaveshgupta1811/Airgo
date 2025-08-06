package com.sunbeam.entities;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Long id;

    @Column(length = 500)
    private String comments;
    
    @Column(nullable = false)
    private Integer rating;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    // Relationship with Booking
    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    // Relationship with User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
