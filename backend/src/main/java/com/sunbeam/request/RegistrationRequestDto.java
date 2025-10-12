package com.sunbeam.request;

import com.sunbeam.entities.Title;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationRequestDto {
	private Title title;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String password;
}
