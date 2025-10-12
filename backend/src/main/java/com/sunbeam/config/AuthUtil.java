package com.sunbeam.config;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.sunbeam.entities.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class AuthUtil {
	
	@Value("${jwt.secretKey}")
	private String jwtSecretKey;

	
	private SecretKey getSecretKey() {
		return Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));
	}

	public String generateJwtToken(User user) {
		return Jwts.builder()
				.subject(user.getEmail())
				.claim("userId",user.getId().toString())
				.claim("role", user.getRole().name())
				.issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + 1000*60*60*3))
				.signWith(getSecretKey())
				.compact();
	}

	public String getEmail(String token) {
		Claims claims = Jwts.parser()
							.verifyWith(getSecretKey())
							.build()
							.parseSignedClaims(token)
							.getPayload();
		
		return claims.getSubject();
	}
	
	
}
