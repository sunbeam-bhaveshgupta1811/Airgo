package com.airline.dto.auth;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

	private String token;
	private String tokenType = "Bearer";
	private Long userId;
	private String email;
	private String firstName;
	private String lastName;
	private String role;
	private String message;
}