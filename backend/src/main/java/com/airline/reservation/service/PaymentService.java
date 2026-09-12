package com.airline.reservation.service;

import com.airline.reservation.dto.request.PaymentRequestDto;
import com.airline.reservation.dto.response.PaymentResponseDto;

import java.util.List;

public interface PaymentService {
    PaymentResponseDto makePayment(PaymentRequestDto request);
    PaymentResponseDto getPaymentByBookingId(Long bookingId);
    PaymentResponseDto getPaymentByTransactionId(String transactionId);
    List<PaymentResponseDto> getAllPayments();
    PaymentResponseDto refundPayment(Long paymentId);

}
