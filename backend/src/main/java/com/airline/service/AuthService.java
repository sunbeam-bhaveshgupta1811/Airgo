package com.airline.service;

import com.airline.dto.ApiResponse;
import com.airline.dto.auth.*;

public interface AuthService {
    ApiResponse<Void> signup(SignupRequest request);
    ApiResponse<AuthResponse> verifyEmail(String token);
    ApiResponse<Void> resendVerificationEmail(String email);
    ApiResponse<AuthResponse> login(LoginRequest request);
    ApiResponse<Void> resetPassword(ResetPasswordRequest request);
    ApiResponse<Void> forgotPassword(ForgotPasswordRequest request);
}
