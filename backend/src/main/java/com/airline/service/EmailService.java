package com.airline.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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


    @Async
    public void sendVerificationEmail(String toEmail, String firstName, String token) {
        try {
            String verifyUrl = baseUrl + "/auth/verify-email?token=" + token;

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
            String resetUrl = baseUrl + "/api/auth/reset-password?token=" + token;

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
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        mailSender.send(message);
    }


}
