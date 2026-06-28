package com.airline.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true")
public class KafkaTopicConfig {

    public static final String FLIGHT_STATUS_EVENTS = "flight-status-events";
    public static final String BOOKING_EVENTS = "booking-events";
    public static final String PAYMENT_EVENTS = "payment-events";

    @Bean
    public NewTopic flightStatusEventsTopic() {
        return TopicBuilder.name(FLIGHT_STATUS_EVENTS)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic bookingEventsTopic() {
        return TopicBuilder.name(BOOKING_EVENTS)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic paymentEventsTopic() {
        return TopicBuilder.name(PAYMENT_EVENTS)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
