package com.sunbeam.service;

import org.modelmapper.ModelMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sunbeam.dao.UserDao;
import com.sunbeam.entities.Role;
import com.sunbeam.entities.User;
import com.sunbeam.exception.UserAlreadyExistsException;
import com.sunbeam.request.RegistrationRequestDto;
import com.sunbeam.response.ApiResponse;
import com.sunbeam.response.RegistrationResponseDto;

@Service
public class AuthService {

    private final PasswordEncoder passwordEncoder_1;
	
    @Autowired
	private UserDao userDao;
	
	@Autowired
    private ModelMapper modelMapper;
	
	private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    AuthService(PasswordEncoder passwordEncoder_1) {
        this.passwordEncoder_1 = passwordEncoder_1;
    }
	
	public ApiResponse<RegistrationResponseDto>  register(RegistrationRequestDto data) {
		
		userDao.findByEmail(data.getEmail()).ifPresent(u ->{
			throw new UserAlreadyExistsException("Email already Exists!");
		});
		
		User user = modelMapper.map(data, User.class);
		
		user.setPasswordHash(passwordEncoder.encode(data.getPassword()));
		user.setRole(Role.user);
		
		RegistrationResponseDto registrationResponseDto = modelMapper.map(userDao.save(user),RegistrationResponseDto.class);
		
		return new ApiResponse<>(true,"User registered successfully!", registrationResponseDto);
		
	}
	
	
	public ApiResponse<User> login(String email, String password) {
        User user = userDao.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return new ApiResponse<>(true,"Login Success..",user);
    }
}
