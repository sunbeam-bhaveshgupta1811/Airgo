package com.sunbeam.request;

import org.hibernate.validator.constraints.Length;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDto {
	
	
	 @NotBlank(message = "Email can't be blank")
	 @Email(message = "Invalid email format")
	 private String email;
	 
	 @NotBlank
	 @Length(min = 3,max=20,message = "Invalid password length")
	 private String password;
	 
	 private String loginType = "USER";
	 
}
