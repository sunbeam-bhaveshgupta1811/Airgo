package com.sunbeam.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "bookings")
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long bookingId;

//    @Column(name = "pnr", unique = true, nullable = false)
//    private String pnr;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_id")
	private User user;

	@Column(name = "flight_id")
	private Long flightId;

	@Column(name = "flight_number", nullable = false)
	private String flightNumber;

	@Column(name = "airline", nullable = false)
	private String airline;

	@Column(name = "source", nullable = false)
	private String source;

	@Column(name = "destination", nullable = false)
	private String destination;

	@Column(name = "departure_date", nullable = false)
	private LocalDate departureDate;

	@Column(name = "departure_time", nullable = false)
	private LocalTime departureTime;

	@Column(name = "arrival_date")
	private LocalDate arrivalDate;

	@Column(name = "arrival_time")
	private LocalTime arrivalTime;

	// Booking Information
	@Column(name = "class_type", nullable = false)
	@Enumerated(EnumType.STRING)
	private ClassType classType;

	@Column(name = "total_passengers", nullable = false)
	private Integer totalPassengers;

	@Column(name = "total_fare", nullable = false, precision = 10, scale = 2)
	private BigDecimal totalFare;

	// Payment Information
	@Column(name = "payment_method")
	@Enumerated(EnumType.STRING)
	private PaymentMethod paymentMethod;

	@Column(name = "payment_status", nullable = false)
	@Enumerated(EnumType.STRING)
	private PaymentStatus paymentStatus;

	@Column(name = "transaction_id")
	private String transactionId;

	// Booking Status
	@Column(name = "booking_status", nullable = false)
	@Enumerated(EnumType.STRING)
	private BookingStatus bookingStatus;

	// Timestamps
	@CreationTimestamp
	@Column(name = "booking_date", nullable = false)
	private LocalDateTime bookingDate;

	@UpdateTimestamp
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@Column(name = "cancelled_at")
	private LocalDateTime cancelledAt;

	// Search Parameters (JSON stored as text)
	@Column(name = "search_params", columnDefinition = "TEXT")
	private String searchParams;

	// Additional Information
	@Column(name = "special_requests", columnDefinition = "TEXT")
	private String specialRequests;

	@Column(name = "notes", columnDefinition = "TEXT")
	private String notes;

	// Relationships
	@OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Passenger> passengers;

	@OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<PaymentTransaction> paymentTransactions;

	public enum ClassType {
		ECONOMY("Economy"), BUSINESS("Business"), FIRST_CLASS("First Class");

		private final String displayName;

		ClassType(String displayName) {
			this.displayName = displayName;
		}

		public String getDisplayName() {
			return displayName;
		}

		@Column(name = "total_amount")
		private Long totalAmount;

		@Column(name = "booking_time")
		private LocalDateTime bookingTime;

		@Column(name = "number_of_passenger")
		private Integer numberOfPassenger;

		@OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
		@JsonManagedReference
		private List<Passenger> passengers = new ArrayList<>();


		@OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
		private Feedback feedback;
	}

	public void addPassenger(Passenger passenger) {
		this.passengers.add(passenger);
		passenger.setBooking(this);
	}

	public enum PaymentMethod {
		CARD("Credit/Debit Card"), UPI("UPI"), NET_BANKING("Net Banking"), WALLET("Digital Wallet");

		private final String displayName;

		PaymentMethod(String displayName) {
			this.displayName = displayName;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public enum PaymentStatus {
		PENDING("Pending"), COMPLETED("Completed"), FAILED("Failed"), REFUNDED("Refunded"),
		PARTIALLY_REFUNDED("Partially Refunded");

		private final String displayName;

		PaymentStatus(String displayName) {
			this.displayName = displayName;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	public enum BookingStatus {
		CONFIRMED("Confirmed"), PENDING("Pending"), CANCELLED("Cancelled"), COMPLETED("Completed"), NO_SHOW("No Show");

		private final String displayName;

		BookingStatus(String displayName) {
			this.displayName = displayName;
		}

		public String getDisplayName() {
			return displayName;
		}
	}

	// Helper methods
	public boolean isActive() {
		return bookingStatus == BookingStatus.CONFIRMED || bookingStatus == BookingStatus.PENDING;
	}

	public boolean isCancellable() {
		return bookingStatus == BookingStatus.CONFIRMED && departureDate.isAfter(LocalDate.now().plusDays(1));
	}

}