package com.airline.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class RateLimitService {

    // In-memory buckets (for production, use Redis-backed Bucket4j)
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    /**
     * Search API: 30 requests/minute per IP
     */
    public Bucket resolveSearchBucket(String ip) {
        return buckets.computeIfAbsent("search:" + ip, key ->
                Bucket.builder()
                        .addLimit(Bandwidth.classic(30, Refill.greedy(30, Duration.ofMinutes(1))))
                        .build());
    }

    /**
     * Booking API: 5 requests/minute per user
     */
    public Bucket resolveBookingBucket(String userId) {
        return buckets.computeIfAbsent("booking:" + userId, key ->
                Bucket.builder()
                        .addLimit(Bandwidth.classic(5, Refill.greedy(5, Duration.ofMinutes(1))))
                        .build());
    }

    /**
     * Login API: 10 attempts/minute per IP
     */
    public Bucket resolveLoginBucket(String ip) {
        return buckets.computeIfAbsent("login:" + ip, key ->
                Bucket.builder()
                        .addLimit(Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1))))
                        .build());
    }
}
