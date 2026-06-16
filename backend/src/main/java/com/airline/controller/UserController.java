package com.airline.controller;

import com.airline.dto.ApiResponse;
import com.airline.dto.auth.ChangePasswordRequest;
import com.airline.request.UpdateProfileRequestDto;
import com.airline.response.UserProfileResponseDto;
import com.airline.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class UserController {

	private final UserService userService;

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserProfileResponseDto>> getMyProfile() {
        return ResponseEntity.ok(
                ApiResponse.success("Profile fetched successfully", userService.getMyProfile())
        );
    }

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserProfileResponseDto>> updateProfile(
            @Valid @RequestBody UpdateProfileRequestDto request) {
        return ResponseEntity.ok(
                ApiResponse.success("Profile updated successfully", userService.updateProfile(request))
        );
    }

    @PutMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(userService.changePassword(request));
    }

}
