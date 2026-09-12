package com.airline.reservation.controller;

import com.airline.reservation.dto.ApiResponse;
import com.airline.reservation.dto.request.*;
import com.airline.reservation.dto.response.AuthResponse;
import com.airline.reservation.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final com.airline.reservation.service.RateLimitService rateLimitService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        String ip = httpRequest.getRemoteAddr();
        if (!rateLimitService.resolveLoginBucket(ip).tryConsume(1)) {
            throw new com.airline.reservation.exception.RateLimitException(
                    "Too many login attempts. Please try again after 1 minute.");
        }
        return ResponseEntity.ok(authService.login(request));
    }



    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signup(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }


    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyEmail(@RequestParam String token) {
        return ResponseEntity.ok(authService.verifyEmail(token));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<Void>> resendVerification(@RequestParam String email) {
        return ResponseEntity.ok(authService.resendVerificationEmail(email));
    }

    /**
     * One-time platform bootstrap. Requires {@code bootstrapSecret} in the body to match
     * app.admin-bootstrap-secret; disabled entirely when that property is unset.
     *
     * The companion GET /admin-exists probe was removed — it publicly advertised when this
     * endpoint was still open, which was the only thing standing between an attacker and
     * the administrator account on a fresh deployment.
     */
    @PostMapping("/create-admin")
    public ResponseEntity<ApiResponse<Void>> createAdmin(
            @Valid @RequestBody SignupRequest request,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        // Reuse the login bucket so the secret cannot be brute-forced from one host.
        String ip = httpRequest.getRemoteAddr();
        if (!rateLimitService.resolveLoginBucket(ip).tryConsume(1)) {
            throw new com.airline.reservation.exception.RateLimitException(
                    "Too many attempts. Please try again after 1 minute.");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.createAdmin(request));
    }

}
