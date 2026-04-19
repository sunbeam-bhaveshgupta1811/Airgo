package com.airline.dto.auth;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SignupRequest {

	@NotBlank(message = "First name is required")
	@Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
	private String firstName;

	@NotBlank(message = "Last name is required")
	@Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
	private String lastName;

	@NotBlank(message = "Email is required")
	@Email(message = "Please provide a valid email address")
	private String email;

	@NotBlank(message = "Password is required")
	@Size(min = 8, message = "Password must be at least 8 characters")
	@Pattern(
			regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
			message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
	)
	private String password;

	@NotBlank(message = "Confirm password is required")
	private String confirmPassword;

	@Pattern(regexp = "^(\\+91)?[6-9][0-9]{9}$", message = "Please provide a valid phone number")
	private String phone;
}