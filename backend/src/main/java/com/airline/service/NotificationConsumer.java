package com.airline.service;

import com.airline.config.KafkaTopicConfig;
import com.airline.dao.BookingDao;
import com.airline.dao.FlightEventDao;
import com.airline.dao.FlightScheduleDao;
import com.airline.dao.NotificationDao;
import com.airline.dao.UserDao;
import com.airline.entity.*;
import com.airline.event.BookingEvent;
import com.airline.event.FlightStatusEvent;
import com.airline.event.PaymentEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@ConditionalOnProperty(name = "app.kafka.enabled", havingValue = "true")
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final NotificationDao notificationDao;
    private final FlightEventDao flightEventDao;
    private final BookingDao bookingDao;
    private final FlightScheduleDao scheduleDao;
    private final UserDao userDao;
    private final EmailService emailService;

    @KafkaListener(topics = KafkaTopicConfig.FLIGHT_STATUS_EVENTS,
            groupId = "airline-notification-group",
            properties = {"spring.json.value.default.type=com.airline.event.FlightStatusEvent"})
    public void handleFlightStatusEvent(FlightStatusEvent event) {
        log.info("Consumed flight-status-event: schedule={}, status={}",
                event.getScheduleId(), event.getNewStatus());

        try {
            // Save flight event log
            FlightSchedule schedule = scheduleDao.findById(event.getScheduleId()).orElse(null);
            if (schedule != null) {
                FlightEvent flightEvent = FlightEvent.builder()
                        .flightSchedule(schedule)
                        .oldStatus(event.getOldStatus())
                        .newStatus(event.getNewStatus())
                        .changedBy(event.getChangedBy())
                        .build();
                flightEventDao.save(flightEvent);
            }

            // Only notify passengers for DELAYED or CANCELLED
            if ("DELAYED".equals(event.getNewStatus()) || "CANCELLED".equals(event.getNewStatus())) {
                List<Booking> affectedBookings = bookingDao.findByFlightScheduleId(event.getScheduleId());

                for (Booking booking : affectedBookings) {
                    if (booking.getStatus() == BookingStatus.CANCELLED) continue;

                    User user = booking.getUser();
                    String statusLabel = event.getNewStatus().equals("DELAYED") ? "Delayed" : "Cancelled";

                    String message = String.format(
                            "Your flight %s from %s to %s on %s has been %s.",
                            event.getFlightNumber(),
                            event.getOriginCity(),
                            event.getDestinationCity(),
                            event.getJourneyDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")),
                            statusLabel.toLowerCase()
                    );

                    // Save notification
                    Notification notification = Notification.builder()
                            .user(user)
                            .type("FLIGHT_" + event.getNewStatus())
                            .message(message)
                            .channel("EMAIL")
                            .referenceId(String.valueOf(event.getScheduleId()))
                            .sent(false)
                            .read(false)
                            .build();
                    notificationDao.save(notification);

                    // Send email
                    sendFlightStatusEmail(user, event, statusLabel);

                    // Mark as sent
                    notification.setSent(true);
                    notification.setSentAt(LocalDateTime.now());
                    notificationDao.save(notification);
                }

                log.info("Notified {} passengers about flight {} status change to {}",
                        affectedBookings.size(), event.getFlightNumber(), event.getNewStatus());
            }
        } catch (Exception e) {
            log.error("Error processing flight-status-event: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(topics = KafkaTopicConfig.BOOKING_EVENTS,
            groupId = "airline-notification-group",
            properties = {"spring.json.value.default.type=com.airline.event.BookingEvent"})
    public void handleBookingEvent(BookingEvent event) {
        log.info("Consumed booking-event: booking={}, type={}",
                event.getBookingReference(), event.getEventType());

        try {
            User user = userDao.findByEmail(event.getUserEmail()).orElse(null);
            if (user == null) return;

            String message;
            String notificationType;

            if ("CREATED".equals(event.getEventType())) {
                message = String.format("Booking %s created for flight %s (%s \u2192 %s) on %s. Amount: \u20b9%s",
                        event.getBookingReference(), event.getFlightNumber(),
                        event.getOriginCity(), event.getDestinationCity(),
                        event.getJourneyDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")),
                        event.getTotalAmount().toPlainString());
                notificationType = "BOOKING_CREATED";
            } else {
                message = String.format("Booking %s for flight %s has been cancelled.",
                        event.getBookingReference(), event.getFlightNumber());
                notificationType = "BOOKING_CANCELLED";
            }

            Notification notification = Notification.builder()
                    .user(user)
                    .type(notificationType)
                    .message(message)
                    .channel("EMAIL")
                    .referenceId(event.getBookingReference())
                    .sent(true)
                    .sentAt(LocalDateTime.now())
                    .read(false)
                    .build();
            notificationDao.save(notification);

        } catch (Exception e) {
            log.error("Error processing booking-event: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(topics = KafkaTopicConfig.PAYMENT_EVENTS,
            groupId = "airline-notification-group",
            properties = {"spring.json.value.default.type=com.airline.event.PaymentEvent"})
    public void handlePaymentEvent(PaymentEvent event) {
        log.info("Consumed payment-event: txn={}, type={}",
                event.getTransactionId(), event.getEventType());

        try {
            User user = userDao.findByEmail(event.getUserEmail()).orElse(null);
            if (user == null) return;

            String message;
            String notificationType;

            switch (event.getEventType()) {
                case "SUCCESS":
                    message = String.format("Payment of \u20b9%s successful for booking %s (Txn: %s).",
                            event.getAmount().toPlainString(), event.getBookingReference(), event.getTransactionId());
                    notificationType = "PAYMENT_SUCCESS";
                    break;
                case "FAILED":
                    message = String.format("Payment failed for booking %s. Reason: %s",
                            event.getBookingReference(), event.getFailureReason() != null ? event.getFailureReason() : "Unknown");
                    notificationType = "PAYMENT_FAILED";
                    break;
                case "REFUNDED":
                    message = String.format("Refund of \u20b9%s processed for booking %s (Txn: %s).",
                            event.getAmount().toPlainString(), event.getBookingReference(), event.getTransactionId());
                    notificationType = "PAYMENT_REFUNDED";
                    break;
                default:
                    return;
            }

            Notification notification = Notification.builder()
                    .user(user)
                    .type(notificationType)
                    .message(message)
                    .channel("EMAIL")
                    .referenceId(event.getBookingReference())
                    .sent(true)
                    .sentAt(LocalDateTime.now())
                    .read(false)
                    .build();
            notificationDao.save(notification);

        } catch (Exception e) {
            log.error("Error processing payment-event: {}", e.getMessage(), e);
        }
    }

    private void sendFlightStatusEmail(User user, FlightStatusEvent event, String statusLabel) {
        try {
            String color = statusLabel.equals("Delayed") ? "#F39C12" : "#E74C3C";
            String icon = statusLabel.equals("Delayed") ? "\u26a0\ufe0f" : "\u274c";
            String footer = statusLabel.equals("Delayed")
                    ? "We will notify you of the updated schedule. We apologize for the inconvenience."
                    : "Your booking will be automatically cancelled and refund will be processed within 5-7 business days.";

            String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
                    <h2 style="color: %s;">%s Flight %s</h2>
                    <p>Dear <strong>%s</strong>,</p>
                    <p>We regret to inform you that your flight has been <strong>%s</strong>.</p>

                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #2E75B6; margin-top: 0;">Flight Details:</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li><strong>Flight:</strong> %s (%s)</li>
                            <li><strong>Route:</strong> %s (%s) \u2192 %s (%s)</li>
                            <li><strong>Date:</strong> %s</li>
                            <li><strong>Departure:</strong> %s</li>
                        </ul>
                    </div>

                    <p>%s</p>

                    <hr style="border: none; border-top: 1px solid #eee;">
                    <p style="color: #aaa; font-size: 12px;">Airgo Airlines \u00b7 Do not reply to this email</p>
                </div>
                """.formatted(
                    color, icon, statusLabel,
                    user.getFirstName(),
                    statusLabel.toLowerCase(),
                    event.getFlightNumber(), event.getAirlineName(),
                    event.getOriginCity(), event.getOriginCode(),
                    event.getDestinationCity(), event.getDestinationCode(),
                    event.getJourneyDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")),
                    event.getDepartureTime().format(DateTimeFormatter.ofPattern("HH:mm")),
                    footer
            );

            emailService.sendFlightStatusNotification(user.getEmail(),
                    icon + " Flight " + statusLabel + " - " + event.getFlightNumber(),
                    htmlContent);

        } catch (Exception e) {
            log.error("Failed to send flight status email to {}: {}", user.getEmail(), e.getMessage());
        }
    }
}
