package com.sunbeam.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sunbeam.request.ForgetPasswordRequest;
import com.sunbeam.request.LoginRequestDto;
import com.sunbeam.request.RegistrationRequestDto;
import com.sunbeam.request.ResetPasswordRequest;
import com.sunbeam.response.ApiResponse;
import com.sunbeam.response.LoginResponseDto;
import com.sunbeam.response.RegistrationResponseDto;
import com.sunbeam.service.AuthService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(@RequestBody LoginRequestDto request) {
        try {
            LoginResponseDto response = authService.login(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", response));
        } catch (RuntimeException ex) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        }
    }

    
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegistrationResponseDto>> registerUser(@RequestBody RegistrationRequestDto dto) {
        ApiResponse<RegistrationResponseDto> response = authService.register(dto);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<?>> forgotPassword(@RequestBody ForgetPasswordRequest request) {
        ApiResponse<?> response = authService.forgotPassword(request);
        return ResponseEntity.ok(response);
    }

    
    @PostMapping("/reset-password")
    public ApiResponse<?> resetPassword(@RequestBody ResetPasswordRequest body) {
        return authService.resetPassword(body);
    }
    
    @GetMapping("/verify-user")
    public void verifyEmail(@RequestParam("token") String token, HttpServletResponse response) throws IOException {
        boolean verified = authService.verifyUser(token);
        if (verified) {
            response.sendRedirect("http://localhost:5173/login");
        } else {
            response.sendRedirect("http://localhost:5173/verify-failed");
        }
    }



}
