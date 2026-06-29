package com.airline.service;

import com.airline.dao.FlightDao;
import com.airline.entity.Booking;
import com.airline.entity.Payment;
import com.airline.util.TicketPdfGenerator;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    private final TicketPdfGenerator ticketPdfGenerator;


    @Async
    public void sendVerificationEmail(String toEmail, String firstName, String token) {
        try {
            String verifyUrl = frontendUrl + "/verify-email?token=" + token;

            String htmlContent = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
                        <h2 style="color: #2E75B6;">✈️ Welcome to AirlineApp, %s!</h2>
                        <p>Thank you for registering. Please verify your email address to activate your account.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="%s"
                               style="background-color: #2E75B6; color: white; padding: 14px 28px;
                                      text-decoration: none; border-radius: 6px; font-size: 16px;">
                                ✅ Verify My Email
                            </a>
                        </div>
                        <p style="color: #888;">This link will expire in <strong>24 hours</strong>.</p>
                        <p style="color: #888;">If you did not register, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #eee;">
                        <p style="color: #aaa; font-size: 12px;">AirlineApp · Do not reply to this email</p>
                    </div>
                    """.formatted(firstName, verifyUrl);

            sendHtmlEmail(toEmail, "✈️ Verify Your Email - AirlineApp", htmlContent);
            log.info("Verification email sent to {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send verification email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String firstName, String token) {
        try {
            String resetUrl = frontendUrl + "/reset-password?token=" + token;

            String htmlContent = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
                        <h2 style="color: #2E75B6;">✈️ Password Reset Request</h2>
                        <p>Hi <strong>%s</strong>, we received a request to reset your password.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="%s"
                               style="background-color: #E74C3C; color: white; padding: 14px 28px;
                                      text-decoration: none; border-radius: 6px; font-size: 16px;">
                                🔒 Reset My Password
                            </a>
                        </div>
                        <p style="color: #888;">This link will expire in <strong>1 hour</strong>.</p>
                        <p style="color: #888;">If you did not request a password reset, please ignore this email.
                           Your password will remain unchanged.</p>
                        <hr style="border: none; border-top: 1px solid #eee;">
                        <p style="color: #aaa; font-size: 12px;">AirlineApp · Do not reply to this email</p>
                    </div>
                    """.formatted(firstName, resetUrl);

            sendHtmlEmail(toEmail, "🔒 Password Reset - AirlineApp", htmlContent);
            log.info("Password reset email sent to {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    public void sendPasswordChangedEmail(String toEmail, String firstName) {
        try {
            String htmlContent = """
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
                        <h2 style="color: #27AE60;">✅ Password Changed Successfully</h2>
                        <p>Hi <strong>%s</strong>, your password has been updated successfully.</p>
                        <p style="color: #E74C3C;">If you did not make this change, please contact support immediately.</p>
                        <hr style="border: none; border-top: 1px solid #eee;">
                        <p style="color: #aaa; font-size: 12px;">AirlineApp · Do not reply to this email</p>
                    </div>
                    """.formatted(firstName);

            sendHtmlEmail(toEmail, "✅ Password Changed - AirlineApp", htmlContent);

        } catch (Exception e) {
            log.error("Failed to send password changed email to {}: {}", toEmail, e.getMessage());
        }
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException {
        if (fromEmail == null || fromEmail.isBlank() || "placeholder".equals(fromEmail)) {
            log.warn("Email not configured (EMAIL_USERNAME not set). Skipping email to: {}", to);
            return;
        }
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        mailSender.send(message);
    }

    /**
     * Call this wrapper from transactional context — it extracts data before async.
     */
    public void sendBookingCancellationEmail(Booking booking, Payment payment) {
        // Extract all data while Hibernate session is open
        String toEmail = booking.getUser().getEmail();
        String firstName = booking.getUser().getFirstName();
        Long bookingId = booking.getId();
        String flightNumber = booking.getFlightSchedule().getFlight().getFlightNumber();
        int passengerCount = booking.getPassengers().size();
        String amount = payment != null ? payment.getAmount().toString() : "0";
        String refundStatus = payment != null ? "Initiated" : "N/A";

        // Now call async with plain strings
        sendCancellationEmailAsync(toEmail, firstName, bookingId, flightNumber, passengerCount, amount, refundStatus);
    }

    @Async
    public void sendCancellationEmailAsync(String toEmail, String firstName, Long bookingId,
                                            String flightNumber, int passengerCount,
                                            String amount, String refundStatus) {
        try {
            String htmlContent = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
                    <h2 style="color: #E74C3C;">Booking Cancelled</h2>
                   \s
                    <p>Hi <strong>%s</strong>,</p>
                    <p>Your flight booking has been successfully cancelled.</p>

                    <h3 style="color: #2E75B6;">Booking Details:</h3>
                    <ul>
                        <li><strong>Booking ID:</strong> %s</li>
                        <li><strong>Flight:</strong> %s</li>
                        <li><strong>Passengers:</strong> %d</li>
                    </ul>

                    <h3 style="color: #27AE60;">Refund Details:</h3>
                    <ul>
                        <li><strong>Amount Paid:</strong> Rs.%s</li>
                        <li><strong>Refund Status:</strong> %s</li>
                    </ul>

                    <p style="color: #888;">Refund will be processed within 5-7 business days.</p>

                    <hr style="border: none; border-top: 1px solid #eee;">
                    <p style="color: #aaa; font-size: 12px;">Airgo · Do not reply to this email</p>
                </div>
               \s""".formatted(firstName, bookingId, flightNumber, passengerCount, amount, refundStatus);

            sendHtmlEmail(toEmail, "Booking Cancelled - Airgo", htmlContent);

            log.info("Booking cancellation email sent to {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send cancellation email: {}", e.getMessage());
        }
    }


    @Async
    public void sendFlightStatusNotification(String toEmail, String subject, String htmlContent) {
        try {
            sendHtmlEmail(toEmail, subject, htmlContent);
            log.info("Flight status notification email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send flight status notification to {}: {}", toEmail, e.getMessage());
        }
    }

    /**
     * Call from transactional context — extracts data then calls async.
     */
    public void sendBookingConfirmationEmail(Booking booking, Payment payment) {
        // Extract all data while Hibernate session is open
        String toEmail = booking.getUser().getEmail();
        String firstName = booking.getUser().getFirstName();
        Long bookingId = booking.getId();
        String flightNumber = booking.getFlightSchedule().getFlight().getFlightNumber();
        int passengerCount = booking.getPassengers().size();
        String amount = payment.getAmount().toString();

        // Generate PDF while session is open
        byte[] pdfBytes;
        try {
            pdfBytes = ticketPdfGenerator.generateTicket(booking, payment);
        } catch (Exception e) {
            log.error("Failed to generate PDF for booking {}: {}", bookingId, e.getMessage());
            pdfBytes = null;
        }

        sendConfirmationEmailAsync(toEmail, firstName, bookingId, flightNumber, passengerCount, amount, pdfBytes);
    }

    @Async
    public void sendConfirmationEmailAsync(String toEmail, String firstName, Long bookingId,
                                            String flightNumber, int passengerCount,
                                            String amount, byte[] pdfBytes) {
        try {
            String htmlContent = """
                <div style="font-family: Arial; max-width: 600px; margin: auto;">
                    <h2 style="color: #27AE60;">Booking Confirmed</h2>

                    <p>Hi <strong>%s</strong>,</p>
                    <p>Your booking has been successfully confirmed.</p>

                    <h3>Booking Details:</h3>
                    <ul>
                        <li><b>Booking ID:</b> %s</li>
                        <li><b>Flight:</b> %s</li>
                        <li><b>Passengers:</b> %d</li>
                    </ul>

                    <h3>Payment:</h3>
                    <ul>
                        <li><b>Amount Paid:</b> Rs.%s</li>
                    </ul>

                    <p>Your ticket is attached as a PDF.</p>
                </div>
                """.formatted(firstName, bookingId, flightNumber, passengerCount, amount);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Booking Confirmed - Airgo");
            helper.setText(htmlContent, true);

            if (pdfBytes != null) {
                helper.addAttachment("ticket.pdf", new ByteArrayResource(pdfBytes));
            }

            mailSender.send(message);

            log.info("Booking confirmation email sent to {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send booking confirmation email: {}", e.getMessage());
        }
    }

}
