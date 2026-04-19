package com.airline.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PaymentRequestDto {
	 private Integer bookingId;
	 private String paymentMethod;
}

