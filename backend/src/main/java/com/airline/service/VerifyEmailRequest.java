package com.airline.service;

import lombok.Data;

@Data
public class VerifyEmailRequest {
    private String token;
}