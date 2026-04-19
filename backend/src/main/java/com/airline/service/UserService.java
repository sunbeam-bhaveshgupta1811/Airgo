package com.airline.service;

import com.airline.response.UserProfileResponseDto;

import java.util.List;

public interface UserService {
    UserProfileResponseDto getMyProfile();
    UserProfileResponseDto getUserById(Long id);
    List<UserProfileResponseDto> getAllUsers();
}
