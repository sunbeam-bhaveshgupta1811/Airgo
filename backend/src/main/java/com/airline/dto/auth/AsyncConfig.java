package com.airline.dto.auth;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync
public class AsyncConfig {
    // Enables @Async on EmailService methods
    // Emails are sent in background thread — API response is not blocked
}