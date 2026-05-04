package com.ecommerce.service.impl;

import com.ecommerce.dto.request.PaymentRequest;
import com.ecommerce.dto.response.PaymentResponse;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.Payment;
import com.ecommerce.exception.BusinessException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.PaymentRepository;
import com.ecommerce.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Slf4j @Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Override
    public PaymentResponse processPayment(PaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", request.getOrderId()));

        paymentRepository.findByOrderId(order.getId()).ifPresent(p -> {
            throw new BusinessException("Payment already exists for order: " + order.getId());
        });

        Payment.PaymentMethod method;
        try {
            method = Payment.PaymentMethod.valueOf(request.getMethod().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Invalid payment method: " + request.getMethod());
        }

        Payment payment = Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .method(method)
                .status(Payment.PaymentStatus.COMPLETED)
                .transactionId(request.getTransactionId() != null
                        ? request.getTransactionId()
                        : "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .build();

        order.setStatus(Order.OrderStatus.CONFIRMED);
        orderRepository.save(order);

        Payment saved = paymentRepository.save(payment);
        log.info("Payment {} processed for order {}", saved.getId(), order.getId());
        return toResponse(saved);
    }

    @Override @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long id) {
        return toResponse(paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", id)));
    }

    @Override @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderId(Long orderId) {
        return toResponse(paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + orderId)));
    }

    @Override @Transactional(readOnly = true)
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public PaymentResponse updatePaymentStatus(Long id, String status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", id));
        try {
            payment.setStatus(Payment.PaymentStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Invalid payment status: " + status);
        }
        return toResponse(paymentRepository.save(payment));
    }

    private PaymentResponse toResponse(Payment p) {
        PaymentResponse r = new PaymentResponse();
        r.setId(p.getId());
        r.setOrderId(p.getOrder().getId());
        r.setAmount(p.getAmount());
        r.setStatus(p.getStatus().name());
        r.setMethod(p.getMethod().name());
        r.setTransactionId(p.getTransactionId());
        r.setCreatedAt(p.getCreatedAt());
        return r;
    }
}
