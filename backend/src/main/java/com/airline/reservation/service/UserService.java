package com.airline.reservation.service;

import com.airline.reservation.dto.ApiResponse;
import com.airline.reservation.dto.request.ChangePasswordRequest;
import com.airline.reservation.dto.request.UpdateProfileRequestDto;
import com.airline.reservation.dto.response.UserProfileResponseDto;

import java.util.List;

public interface UserService {
    UserProfileResponseDto getMyProfile();
    UserProfileResponseDto getUserById(Long id);
    List<UserProfileResponseDto> getAllUsers();
    ApiResponse<Void> changePassword(ChangePasswordRequest request);
    UserProfileResponseDto updateProfile(UpdateProfileRequestDto request);
    UserProfileResponseDto uploadProfileImage(org.springframework.web.multipart.MultipartFile file);
}
