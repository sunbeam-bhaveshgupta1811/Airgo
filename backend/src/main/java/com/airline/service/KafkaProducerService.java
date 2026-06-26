package com.airline.service;

import com.airline.config.KafkaTopicConfig;
import com.airline.event.BookingEvent;
import com.airline.event.FlightStatusEvent;
import com.airline.event.PaymentEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishFlightStatusEvent(FlightStatusEvent event) {
        try {
            kafkaTemplate.send(KafkaTopicConfig.FLIGHT_STATUS_EVENTS,
                    String.valueOf(event.getScheduleId()), event);
            log.info("Published flight-status-event: schedule={}, status={}",
                    event.getScheduleId(), event.getNewStatus());
        } catch (Exception e) {
            log.error("Failed to publish flight-status-event: {}", e.getMessage());
        }
    }

    public void publishBookingEvent(BookingEvent event) {
        try {
            kafkaTemplate.send(KafkaTopicConfig.BOOKING_EVENTS,
                    String.valueOf(event.getBookingId()), event);
            log.info("Published booking-event: booking={}, type={}",
                    event.getBookingReference(), event.getEventType());
        } catch (Exception e) {
            log.error("Failed to publish booking-event: {}", e.getMessage());
        }
    }

    public void publishPaymentEvent(PaymentEvent event) {
        try {
            kafkaTemplate.send(KafkaTopicConfig.PAYMENT_EVENTS,
                    String.valueOf(event.getPaymentId()), event);
            log.info("Published payment-event: txn={}, type={}",
                    event.getTransactionId(), event.getEventType());
        } catch (Exception e) {
            log.error("Failed to publish payment-event: {}", e.getMessage());
        }
    }
}
