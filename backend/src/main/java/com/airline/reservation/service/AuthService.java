package com.airline.reservation.service;

import com.airline.reservation.dto.ApiResponse;
import com.airline.reservation.dto.request.*;
import com.airline.reservation.dto.response.AuthResponse;

public interface AuthService {
    ApiResponse<Void> signup(SignupRequest request);
    ApiResponse<AuthResponse> verifyEmail(String token);
    ApiResponse<Void> resendVerificationEmail(String email);
    ApiResponse<AuthResponse> login(LoginRequest request);
    ApiResponse<Void> resetPassword(ResetPasswordRequest request);
    ApiResponse<Void> forgotPassword(ForgotPasswordRequest request);
    ApiResponse<Void> createAdmin(SignupRequest request);
}
