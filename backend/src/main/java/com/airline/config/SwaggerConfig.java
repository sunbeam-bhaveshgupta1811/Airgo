package com.airline.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title       = "✈️ Airline Reservation System API",
                version     = "1.0",
                description = "Complete Airline Reservation backend — Auth, Flights, Bookings, Payments"
        )
)
@SecurityScheme(
        name        = "bearerAuth",
        type        = SecuritySchemeType.HTTP,
        scheme      = "bearer",
        bearerFormat = "JWT",
        in          = SecuritySchemeIn.HEADER,
        description = "Paste your JWT token here (without 'Bearer ' prefix)"
)
public class SwaggerConfig {
    // Swagger UI: http://localhost:8080/swagger-ui.html
    // After login, click Authorize button and paste your token
}
