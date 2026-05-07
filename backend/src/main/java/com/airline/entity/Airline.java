package com.airline.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "airlines")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Airline {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String name;

	@Column(nullable = false, unique = true, length = 3)
	private String code;                  // code like 6E

	@Column(nullable = false)
	private String country;

	private String contactEmail;

	private String contactPhone;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private AirlineStatus status;

	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
		if (status == null) status = AirlineStatus.ACTIVE;
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
}
