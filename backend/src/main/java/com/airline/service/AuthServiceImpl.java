package com.airline.service;

import com.airline.dao.UserDao;
import com.airline.dto.ApiResponse;
import com.airline.dto.auth.*;
import com.airline.entity.ApprovalStatus;
import com.airline.entity.Role;
import com.airline.entity.User;
import com.airline.exception.BadRequestException;
import com.airline.exception.ResourceNotFoundException;
import com.airline.exception.UserAlreadyExistsException;
import com.airline.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

	private final UserDao userDao;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final UserDetailsService userDetailsService;

	private final AuthenticationManager authenticationManager;
	private final EmailService emailService;

	@Transactional
	public ApiResponse<Void> signup(SignupRequest request) {

		if (!request.getPassword().equals(request.getConfirmPassword())) {
			throw new BadRequestException("Passwords do not match");
		}

		if (userDao.existsByEmail(request.getEmail())) {
			throw new UserAlreadyExistsException("Email is already registered: " + request.getEmail());
		}

		if (request.getPhone() != null && !request.getPhone().isBlank()
				&& userDao.existsByPhone(request.getPhone())) {
			throw new UserAlreadyExistsException("Phone number is already registered");
		}
		String verificationToken = UUID.randomUUID().toString();

		Role userRole = Role.USER;
		ApprovalStatus approvalStatus = null;

		if (request.getRole() != null && "AIRPORT_MANAGER".equalsIgnoreCase(request.getRole())) {
			userRole = Role.AIRPORT_MANAGER;
			approvalStatus = ApprovalStatus.PENDING;
		}

		User user = User.builder()
				.firstName(request.getFirstName())
				.lastName(request.getLastName())
				.email(request.getEmail().toLowerCase().trim())
				.password(passwordEncoder.encode(request.getPassword()))
				.phone(request.getPhone())
				.role(userRole)
				.approvalStatus(approvalStatus)
				.enabled(false)
				.emailVerified(false)
				.verificationToken(verificationToken)
				.verificationTokenExpiry(LocalDateTime.now().plusHours(24))
				.build();


		userDao.save(user);

		String successMessage = userRole == Role.AIRPORT_MANAGER
				? "Registration successful! Please verify your email. After verification, your account will need Admin approval before you can log in."
				: "Registration successful! Please check your email to verify your account.";

		emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), verificationToken);
		log.info("New user registered: {} - verification email sent", user.getEmail());

		return ApiResponse.success(successMessage, null);
	}

	@Transactional
	public ApiResponse<AuthResponse> verifyEmail(String token) {

		User user = userDao.findByVerificationToken(token)
				.orElseThrow(() -> new BadRequestException("Invalid or expired verification link"));

		if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
			throw new BadRequestException("Verification link has expired. Please request a new one.");
		}

		user.setEmailVerified(true);
		user.setVerificationToken(null);
		user.setVerificationTokenExpiry(null);

		// Only auto-enable if NOT an airport manager pending approval
		if (user.getRole() == Role.AIRPORT_MANAGER && user.getApprovalStatus() == ApprovalStatus.PENDING) {
			user.setEnabled(false); // Keep disabled until admin approves
		} else {
			user.setEnabled(true);
		}

		userDao.save(user);

		// Don't auto-login managers pending approval
		if (user.getRole() == Role.AIRPORT_MANAGER && user.getApprovalStatus() == ApprovalStatus.PENDING) {
			log.info("Email verified for manager: {} - awaiting admin approval", user.getEmail());
			AuthResponse pendingResponse = AuthResponse.builder()
					.email(user.getEmail())
					.firstName(user.getFirstName())
					.lastName(user.getLastName())
					.role(user.getRole().name())
					.approvalStatus("PENDING")
					.message("Email verified successfully! Your account is pending admin approval.")
					.build();
			return ApiResponse.success("Email verified. Awaiting admin approval.", pendingResponse);
		}

		UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
		Map<String, Object> verifyClaims = new java.util.HashMap<>();
		verifyClaims.put("userId", user.getId());
		verifyClaims.put("role", user.getRole().name());
		if (user.getAirport() != null) {
			verifyClaims.put("airportId", user.getAirport().getId());
		}
		String jwtToken = jwtUtil.generateToken(userDetails, verifyClaims);

		log.info("Email verified for user: {}", user.getEmail());

		AuthResponse authResponse = AuthResponse.builder()
				.token(jwtToken)
				.tokenType("Bearer")
				.userId(user.getId())
				.email(user.getEmail())
				.firstName(user.getFirstName())
				.lastName(user.getLastName())
				.role(user.getRole().name())
				.airportId(user.getAirport() != null ? user.getAirport().getId() : null)
				.message("Email verified successfully! You are now logged in.")
				.build();

		return ApiResponse.success("Email verified successfully", authResponse);
	}

	@Transactional
	public ApiResponse<Void> resendVerificationEmail(String email) {

		User user = userDao.findByEmail(email.toLowerCase().trim())
				.orElseThrow(() -> new ResourceNotFoundException("No account found with email: " + email));

		if (user.isEmailVerified()) {
			throw new BadRequestException("Email is already verified");
		}

		String newToken = UUID.randomUUID().toString();
		user.setVerificationToken(newToken);
		user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));
		userDao.save(user);

		emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), newToken);

		return ApiResponse.success("Verification email resent. Please check your inbox.", null);
	}

	@Transactional(readOnly = true)
	public ApiResponse<AuthResponse> login(LoginRequest request) {
		User user = userDao.findByEmail(request.getEmail().toLowerCase().trim())
				.orElseThrow(() -> new BadRequestException("Invalid email or password"));

		if (!user.isEmailVerified()) {
			throw new BadRequestException(
					"Email not verified. Please check your inbox or request a new verification link.");
		}

		if (!user.isEnabled()) {
			throw new BadRequestException("Your account has been disabled. Please contact support.");
		}

		// Check approval status for Airport Managers
		if (user.getRole() == Role.AIRPORT_MANAGER) {
			if (user.getApprovalStatus() == null || user.getApprovalStatus() == ApprovalStatus.PENDING) {
				throw new BadRequestException("Your account is pending Admin approval. Please wait until your account has been approved.");
			}
			if (user.getApprovalStatus() == ApprovalStatus.REJECTED) {
				throw new BadRequestException("Your account has been rejected by the Admin. Please contact support.");
			}
		}

		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(
							request.getEmail().toLowerCase().trim(),
							request.getPassword()
					)
			);
		} catch (BadCredentialsException e) {
			throw new BadRequestException("Invalid email or password");
		} catch (AuthenticationException e) {
			throw new BadRequestException("Authentication failed: " + e.getMessage());
		}

		UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
		Map<String, Object> claims = new java.util.HashMap<>();
		claims.put("userId", user.getId());
		claims.put("role", user.getRole().name());
		claims.put("name", user.getFirstName() + " " + user.getLastName());
		if (user.getAirport() != null) {
			claims.put("airportId", user.getAirport().getId());
		}
		String token = jwtUtil.generateToken(userDetails, claims);

		log.info("User logged in: {}", user.getEmail());

		AuthResponse authResponse = AuthResponse.builder()
				.token(token)
				.tokenType("Bearer")
				.userId(user.getId())
				.email(user.getEmail())
				.firstName(user.getFirstName())
				.lastName(user.getLastName())
				.role(user.getRole().name())
				.airportId(user.getAirport() != null ? user.getAirport().getId() : null)
				.message("Login successful! Welcome back, " + user.getFirstName() + ".")
				.build();

		return ApiResponse.success("Login successful", authResponse);
    }

	@Transactional
	public ApiResponse<Void> forgotPassword(ForgotPasswordRequest request) {
		userDao.findByEmail(request.getEmail().toLowerCase().trim()).ifPresent(user -> {
			String resetToken = UUID.randomUUID().toString();
			user.setResetPasswordToken(resetToken);
			user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(1));
			userDao.save(user);
			emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), resetToken);
			log.info("Password reset email sent to {}", user.getEmail());
		});

		return ApiResponse.success(
				"If an account exists with that email, a password reset link has been sent.", null);
	}

	@Transactional
	public ApiResponse<Void> resetPassword(ResetPasswordRequest request) {

		if (!request.getNewPassword().equals(request.getConfirmPassword())) {
			throw new BadRequestException("Passwords do not match");
		}

		User user = userDao.findByResetPasswordToken(request.getToken())
				.orElseThrow(() -> new BadRequestException("Invalid or expired password reset link"));

		if (user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
			throw new BadRequestException("Password reset link has expired. Please request a new one.");
		}

		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		user.setResetPasswordToken(null);
		user.setResetPasswordTokenExpiry(null);
		userDao.save(user);

		emailService.sendPasswordChangedEmail(user.getEmail(), user.getFirstName());

		log.info("Password reset successful for user: {}", user.getEmail());

		return ApiResponse.success("Password reset successful! You can now log in with your new password.", null);
	}

	@Transactional
	public ApiResponse<Void> createAdmin(SignupRequest request) {
		// Only allow one admin
		if (userDao.existsByRole(Role.ADMIN)) {
			throw new BadRequestException("Admin account already exists. Only one Admin is allowed.");
		}

		if (!request.getPassword().equals(request.getConfirmPassword())) {
			throw new BadRequestException("Passwords do not match");
		}

		if (userDao.existsByEmail(request.getEmail())) {
			throw new UserAlreadyExistsException("Email is already registered: " + request.getEmail());
		}

		String verificationToken = UUID.randomUUID().toString();

		User admin = User.builder()
				.firstName(request.getFirstName())
				.lastName(request.getLastName())
				.email(request.getEmail().toLowerCase().trim())
				.password(passwordEncoder.encode(request.getPassword()))
				.phone(request.getPhone())
				.role(Role.ADMIN)
				.enabled(false)
				.emailVerified(false)
				.verificationToken(verificationToken)
				.verificationTokenExpiry(LocalDateTime.now().plusHours(24))
				.build();

		userDao.save(admin);
		emailService.sendVerificationEmail(admin.getEmail(), admin.getFirstName(), verificationToken);
		log.info("Admin account created: {} - verification email sent", admin.getEmail());

		return ApiResponse.success("Admin account created! Please check your email to verify your account.", null);
	}

	@Transactional(readOnly = true)
	public ApiResponse<Boolean> adminExists() {
		boolean exists = userDao.existsByRole(Role.ADMIN);
		return ApiResponse.success("Admin existence checked", exists);
	}
}
