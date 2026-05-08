package com.airline.controller;

import com.airline.dto.ApiResponse;
import com.airline.request.PaymentRequestDto;
import com.airline.response.PaymentResponseDto;
import com.airline.service.PaymentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/payments")
    public ApiResponse<PaymentResponseDto> makePayment(@Valid @RequestBody PaymentRequestDto request) {
        return ApiResponse.success("Payment processed",paymentService.makePayment(request));
    }

    @GetMapping("/payments/booking/{bookingId}")
    public ApiResponse<PaymentResponseDto> getPaymentByBookingId(@PathVariable Long bookingId) {
        return ApiResponse.success("Payment fetched",paymentService.getPaymentByBookingId(bookingId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/payments")
    public ApiResponse<List<PaymentResponseDto>> getAllPayments() {
        return ApiResponse.success("Payments fetched",paymentService.getAllPayments());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/payments/transaction/{transactionId}")
    public ApiResponse<PaymentResponseDto>
    getPaymentByTransactionId(@PathVariable String transactionId) {
        return ApiResponse.success("Payment fetched",paymentService.getPaymentByTransactionId(transactionId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/admin/payments/{paymentId}/refund")
    public ApiResponse<PaymentResponseDto> refundPayment(@PathVariable Long paymentId) {
        return ApiResponse.success("Payment refunded",paymentService.refundPayment(paymentId));
    }
}
