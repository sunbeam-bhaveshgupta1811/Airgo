package com.airline.reservation.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;
    private final CorsConfigurationSource corsConfigurationSource;
    private final JwtAuthenticationEntryPoint authenticationEntryPoint;

    private static final String[] PUBLIC_URLS = {
            "/api/auth/**",
            "/api/airlines",
            "/api/airlines/**",
            "/api/airports",
            "/api/airports/**",

            "/api/flights",
            "/api/flights/**",

            "/error",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/ws/**"
    };

    /**
     * The read-only seat map is deliberately public so the seat picker works before login.
     * Everything else under /api/seats (notably POST /api/seats/select) requires
     * authentication — it used to be covered by a blanket "/api/seats/**" permitAll, which
     * let anyone on the internet reassign any passenger's seat by guessing sequential ids.
     */
    private static final String[] PUBLIC_GET_URLS = {
            "/api/seats/map/**"
    };

    private static final String[] AUTHENTICATED_URLS = {
            "/user/**",
            "/bookings/**",
            "/payments/**",
            "/passengers/**",
            "/api/terminals/**",
            "/api/gates/**",
            "/api/notifications/**"
    };
    private static final String[] MANAGER_URLS = {
            "/manager/**"
    };
    private static final String[] ADMIN_URLS = {
            "/admin/**"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, PUBLIC_GET_URLS).permitAll()
                        .requestMatchers(PUBLIC_URLS).permitAll()
                        .requestMatchers(MANAGER_URLS).hasAnyRole("ADMIN", "AIRPORT_MANAGER")
                        .requestMatchers(ADMIN_URLS).hasRole("ADMIN")
                        .requestMatchers(AUTHENTICATED_URLS).authenticated()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // Without this, Spring falls back to Http403ForbiddenEntryPoint and every
                // expired token surfaces as 403 — which the frontend interceptor ignores.
                .exceptionHandling(ex -> ex.authenticationEntryPoint(authenticationEntryPoint))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}