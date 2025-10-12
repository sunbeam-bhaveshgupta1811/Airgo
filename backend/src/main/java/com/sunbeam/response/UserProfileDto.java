package com.sunbeam.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileDto{
	private Long id;
	private String firstName;
	private String lastName;
	private String email;
	private String mobile_no;
}
