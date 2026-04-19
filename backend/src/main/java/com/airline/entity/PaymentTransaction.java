//package com.sunbeam.entities;
//
//import java.math.BigDecimal;
//
//import java.time.LocalDateTime;
//
//import org.hibernate.annotations.CreationTimestamp;
//
//import jakarta.persistence.Column;
//import jakarta.persistence.Entity;
//import jakarta.persistence.EnumType;
//import jakarta.persistence.Enumerated;
//import jakarta.persistence.FetchType;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.JoinColumn;
//import jakarta.persistence.ManyToOne;
//import jakarta.persistence.Table;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@Entity
//@Table(name = "payment_transactions")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class PaymentTransaction {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "booking_id", nullable = false)
//    private Booking booking;
//
//    @Column(name = "transaction_id", unique = true, nullable = false)
//    private String transactionId;
//
//    @Column(name = "payment_method", nullable = false)
//    @Enumerated(EnumType.STRING)
//    private Booking.PaymentMethod paymentMethod;
//
//    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
//    private BigDecimal amount;
//
//    @Column(name = "currency", nullable = false)
//    private String currency = "INR";
//
//    @Column(name = "payment_status", nullable = false)
//    @Enumerated(EnumType.STRING)
//    private PaymentTransactionStatus status;
//
//    @Column(name = "gateway_transaction_id")
//    private String gatewayTransactionId;
//
//    @Column(name = "gateway_response", columnDefinition = "TEXT")
//    private String gatewayResponse;
//
//    @Column(name = "payment_details", columnDefinition = "TEXT")
//    private String paymentDetails; // JSON string for payment-specific details
//
//    @Column(name = "failure_reason")
//    private String failureReason;
//
//    @CreationTimestamp
//    @Column(name = "created_at")
//    private LocalDateTime createdAt;
//
//    @Column(name = "processed_at")
//    private LocalDateTime processedAt;
//
//    // Enum for payment transaction status
//    public enum PaymentTransactionStatus {
//        INITIATED("Initiated"),
//        PROCESSING("Processing"),
//        SUCCESS("Success"),
//        FAILED("Failed"),
//        CANCELLED("Cancelled"),
//        REFUNDED("Refunded");
//
//        private final String displayName;
//
//        PaymentTransactionStatus(String displayName) {
//            this.displayName = displayName;
//        }
//
//        public String getDisplayName() {
//            return displayName;
//        }
//    }
//}