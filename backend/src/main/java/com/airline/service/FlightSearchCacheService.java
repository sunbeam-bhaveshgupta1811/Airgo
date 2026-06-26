package com.airline.service;

import com.airline.response.FlightScheduleResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class FlightSearchCacheService {

    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${app.cache.flight-search-ttl:5}")
    private int cacheTtlMinutes;

    private static final String CACHE_PREFIX = "flights:";

    public String generateCacheKey(String from, String to, String date, String travelClass) {
        String classKey = (travelClass != null && !travelClass.isBlank()) ? travelClass.toUpperCase() : "ALL";
        return CACHE_PREFIX + from.toUpperCase() + ":" + to.toUpperCase() + ":" + date + ":" + classKey;
    }

    @SuppressWarnings("unchecked")
    public List<FlightScheduleResponseDto> getFromCache(String cacheKey) {
        try {
            Object cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) {
                log.info("Cache HIT for key: {}", cacheKey);
                return (List<FlightScheduleResponseDto>) cached;
            }
        } catch (Exception e) {
            log.warn("Cache read failed for key {}: {}", cacheKey, e.getMessage());
        }
        return null;
    }

    public void putInCache(String cacheKey, List<FlightScheduleResponseDto> results) {
        try {
            redisTemplate.opsForValue().set(cacheKey, results, cacheTtlMinutes, TimeUnit.MINUTES);
            log.info("Cache SET for key: {} (TTL: {} min)", cacheKey, cacheTtlMinutes);
        } catch (Exception e) {
            log.warn("Cache write failed for key {}: {}", cacheKey, e.getMessage());
        }
    }

    public void invalidateFlightCache() {
        try {
            var keys = redisTemplate.keys(CACHE_PREFIX + "*");
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
                log.info("Invalidated {} flight search cache entries", keys.size());
            }
        } catch (Exception e) {
            log.warn("Cache invalidation failed: {}", e.getMessage());
        }
    }
}
