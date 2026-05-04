package com.ecommerce.service;

import com.ecommerce.dto.request.PaymentRequest;
import com.ecommerce.dto.response.PaymentResponse;
import java.util.List;

public interface PaymentService {
    PaymentResponse processPayment(PaymentRequest request);
    PaymentResponse getPaymentById(Long id);
    PaymentResponse getPaymentByOrderId(Long orderId);
    List<PaymentResponse> getAllPayments();
    PaymentResponse updatePaymentStatus(Long id, String status);
}
