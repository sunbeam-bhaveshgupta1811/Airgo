package com.airline.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="users")
@Builder
public class User {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long Id;

	@Column(nullable=false,length=50,unique = true)
	private String email;


	@Column(nullable = false)
	private String password;

	@Column(nullable = false,length=50)
	private String firstName;

	@Column(nullable = false,length=50)
	private String lastName;

	@Column(unique = true)
	private String phone;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Role role;


	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;


	@Column(nullable = false)
	private boolean emailVerified = false;

	@Column(unique = true)
	private String verificationToken;

	private LocalDateTime verificationTokenExpiry;

	@Column(unique = true)
	private String resetPasswordToken;

	private LocalDateTime resetPasswordTokenExpiry;
	
	
//	@OneToMany(mappedBy="admin", cascade=CascadeType.ALL)
//	@JsonIgnore
//	private List<AirlineDetail> managedAirlines = new ArrayList<>();
//
//	@OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
//	@JsonIgnore
//    private List<AddFlights> managedFlights = new ArrayList<>();
//
//    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL)
//    @JsonIgnore
//    private List<ScheduleFlight> scheduledFlights = new ArrayList<>();
    
//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
//    @JsonIgnore
//    private List<Booking> bookings = new ArrayList<>();
//
//    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
//    @JsonIgnore
//    private List<Feedback> feedbacks = new ArrayList<>();

	
//	@Override
//	public Collection<? extends GrantedAuthority> getAuthorities() {
//	    return List.of(new SimpleGrantedAuthority("ROLE_" + this.role));
//	}
//
//	@Override
//	public String getPassword() {
//		return passwordHash;
//	}
//
//	@Override
//	public String getUsername() {
//		return email;
//	}

	

	@Column(nullable = false)
	private boolean enabled = false;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
	

}
