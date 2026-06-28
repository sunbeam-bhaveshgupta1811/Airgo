package com.airline.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class RateLimitService {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    /**
     * Search API: 30 requests/minute per IP
     */
    public Bucket resolveSearchBucket(String ip) {
        return buckets.computeIfAbsent("search:" + ip, key ->
                Bucket.builder()
                        .addLimit(Bandwidth.builder().capacity(30).refillGreedy(30, Duration.ofMinutes(1)).build())
                        .build());
    }

    /**
     * Booking API: 5 requests/minute per user
     */
    public Bucket resolveBookingBucket(String userId) {
        return buckets.computeIfAbsent("booking:" + userId, key ->
                Bucket.builder()
                        .addLimit(Bandwidth.builder().capacity(5).refillGreedy(5, Duration.ofMinutes(1)).build())
                        .build());
    }

    /**
     * Login API: 10 attempts/minute per IP
     */
    public Bucket resolveLoginBucket(String ip) {
        return buckets.computeIfAbsent("login:" + ip, key ->
                Bucket.builder()
                        .addLimit(Bandwidth.builder().capacity(10).refillGreedy(10, Duration.ofMinutes(1)).build())
                        .build());
    }
}
