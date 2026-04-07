package com.sunbeam.service;

import lombok.Data;

@Data
public class VerifyEmailRequest {
    private String token;
}