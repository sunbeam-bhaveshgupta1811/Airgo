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
	private Long id;
	private Title title;
    private String firstName;
    private String lastName;
    private String email;
    private String mobileNo;
    private String password;
}
