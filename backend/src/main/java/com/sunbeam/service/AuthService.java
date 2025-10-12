package com.sunbeam.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sunbeam.config.AuthUtil;
import com.sunbeam.dao.UserDao;
import com.sunbeam.entities.Role;
import com.sunbeam.entities.User;
import com.sunbeam.exception.ResourceNotFoundException;
import com.sunbeam.exception.UserAlreadyExistsException;
import com.sunbeam.request.ForgetPasswordRequest;
import com.sunbeam.request.LoginRequestDto;
import com.sunbeam.request.RegistrationRequestDto;
import com.sunbeam.request.ResetPasswordRequest;
import com.sunbeam.response.ApiResponse;
import com.sunbeam.response.LoginResponseDto;
import com.sunbeam.response.RegistrationResponseDto;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
	
	private final UserDao userDao;
	
    private final ModelMapper modelMapper;
    
    private final AuthenticationManager authenticationManager;
    
    private final AuthUtil authUtil;
	
    private final PasswordEncoder passwordEncoder;
    
    private final EmailService emailService;
	
	public ApiResponse<RegistrationResponseDto> register(RegistrationRequestDto data) {
		
		if (userDao.existsByEmail(data.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists");
        }
		
		User user = modelMapper.map(data, User.class);
		user.setMobile_no(data.getPhone());
		user.setPasswordHash(passwordEncoder.encode(data.getPassword()));
		user.setRole(Role.USER);
		user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
		user.setVerified(false);
		
		String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
		
		RegistrationResponseDto registrationResponseDto = modelMapper.map(userDao.save(user),RegistrationResponseDto.class);
		
		 String link = "http://localhost:8080/auth/verify-user?token=" + user.getVerificationToken();
	        emailService.sendEmail(user.getEmail(), "Verify your account",
	                "Click here to verify: " + link);
		
		return new ApiResponse<>(true,"User registered successfully!", registrationResponseDto);
		
	}
	
	
	public boolean verifyUser(String token) {
        Optional<User> userOpt = userDao.findByVerificationToken(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            if(user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            	throw new RuntimeException("Verification code has expired");
            }
            else if(user.getVerificationToken().equals(token)) {
            	user.setVerified(true);
                user.setVerificationToken(null);
                user.setVerificationCodeExpiresAt(null);
                userDao.save(user);
            }else {
            	throw new RuntimeException("Invalid verification token..");
            }
            return true;
        }
        return false;
    }
	
	public LoginResponseDto login(LoginRequestDto loginRequestDto) {
		
		User userExists = userDao.findByEmail(loginRequestDto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + loginRequestDto.getEmail()));

        if (!userExists.isVerified()) {
            throw new RuntimeException("Account not verified. Please check your email.");
        }
		
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword())
				);
		
		User user = (User) authentication.getPrincipal();
	    String requestedType = loginRequestDto.getLoginType().toUpperCase();
	    String userRole = user.getRole().name().toUpperCase();
	    String firstName = user.getFirstName();

	    if (!userRole.equalsIgnoreCase(requestedType)) {
	        throw new RuntimeException("Access denied: You are not allowed to log in as " + requestedType);
	    }

		
		
		if (user.getRole() == Role.ADMIN) {
	        System.out.println("Admin logged in: " + user.getEmail());
	    } else if (user.getRole() == Role.USER) {
	        System.out.println("User logged in: " + user.getEmail());
	    }
		
		String token = authUtil.generateJwtToken(user);
        return new LoginResponseDto(token,user.getId(),user.getRole().name(),firstName);
    }


	public ApiResponse<?> forgotPassword(ForgetPasswordRequest email) {
		User user = userDao.findByEmail(email.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        
        String otp = generateVerificationCode();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);
        
        
        user.setOtp(otp);
        user.setOtp_expires_at(expiry);
        userDao.save(user);
        

        String body = "Your OTP for password reset is: " + otp + " (valid for 10 minutes)";
        emailService.sendEmail(user.getEmail(), "Password Reset OTP",body);
        return new ApiResponse<>(true,"Password Reset OTP send in your email",body);
        
	}


	public ApiResponse<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordToken) {
		
		User user = userDao.findByEmail(resetPasswordToken.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
		
		if (user.getOtp_expires_at().isBefore(LocalDateTime.now())) {
		    return new ApiResponse<>(false, "OTP has expired", null);
		}

		System.out.println(resetPasswordToken.getNewPassword());
	        if (!user.getOtp().equals(resetPasswordToken.getOtp())) {
	            throw new RuntimeException("Invalid OTP");
	        }
	        
	        user.setPasswordHash(passwordEncoder.encode(resetPasswordToken.getNewPassword()));
	        user.setOtp(null);
	        user.setOtp_expires_at(null);
	        userDao.save(user);

        return new ApiResponse<>(true, "Password reset successfully", null);
	}

	
	private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
	
}
