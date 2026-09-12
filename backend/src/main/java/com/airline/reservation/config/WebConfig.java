package com.airline.reservation.config;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@Slf4j
public class WebConfig {

    /**
     * Exact origins, from configuration — never wildcard patterns.
     *
     * This previously allowed "https://*.vercel.app" and "https://*.onrender.com" together
     * with allowCredentials(true). Those are shared hosting domains: anyone can deploy to
     * one and inherit a trusted origin, so the allowlist effectively trusted the public.
     */
    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(o -> !o.isEmpty())
                .toList();

        if (origins.stream().anyMatch(o -> o.contains("*"))) {
            throw new IllegalStateException(
                    "app.cors.allowed-origins must list exact origins; wildcards are unsafe "
                            + "with credentialed CORS. Got: " + allowedOrigins);
        }

        log.info("CORS allowed origins: {}", origins);
        config.setAllowedOrigins(origins);

        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));

        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin"));
        config.setExposedHeaders(List.of("Retry-After"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
