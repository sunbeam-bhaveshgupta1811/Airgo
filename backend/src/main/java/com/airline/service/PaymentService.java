package com.airline.service;

import com.airline.request.PaymentRequestDto;
import com.airline.response.PaymentResponseDto;

import java.util.List;

public interface PaymentService {
    PaymentResponseDto makePayment(PaymentRequestDto request);
    PaymentResponseDto getPaymentByBookingId(Long bookingId);
    PaymentResponseDto getPaymentByTransactionId(String transactionId);
    List<PaymentResponseDto> getAllPayments();
    PaymentResponseDto refundPayment(Long paymentId);

}
