package com.airline.reservation.security;

import com.airline.reservation.dto.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Returns 401 for unauthenticated requests.
 *
 * Without an explicit entry point, Spring Security falls back to Http403ForbiddenEntryPoint,
 * so a missing or expired token produced a 403. The frontend's axios interceptor only reacts
 * to 401, so session expiry never triggered the "please log in again" redirect and users were
 * left staring at per-page error toasts instead.
 *
 * 401 now means "you are not authenticated"; 403 is reserved for "you are authenticated but
 * this resource is not yours" (see AccessGuard).
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        objectMapper.writeValue(
                response.getWriter(),
                ApiResponse.error("Authentication required. Please log in again."));
    }
}
