package com.sunbeam.response;

import com.sunbeam.entities.Role;
import com.sunbeam.entities.Title;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationResponseDto {
	private Title title;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Role role;
}
