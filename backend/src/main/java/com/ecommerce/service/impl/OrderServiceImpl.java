package com.ecommerce.service.impl;

import com.ecommerce.dto.request.OrderRequest;
import com.ecommerce.dto.response.OrderItemResponse;
import com.ecommerce.dto.response.OrderResponse;
import com.ecommerce.entity.*;
import com.ecommerce.exception.BusinessException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.*;
import com.ecommerce.service.CartService;
import com.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Slf4j @Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartService cartService;

    @Override
    public OrderResponse placeOrder(OrderRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.getUserId()));

        Cart cart = cartRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new BusinessException("Cart is empty"));
        if (cart.getItems().isEmpty()) throw new BusinessException("Cart is empty");

        Order order = Order.builder()
                .user(user)
                .totalAmount(cart.getTotalAmount())
                .shippingAddress(request.getShippingAddress())
                .build();

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            Product product = cartItem.getProduct();
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new BusinessException("Insufficient stock for: " + product.getName());
            }
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            return OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();
        }).collect(Collectors.toList());

        order.setItems(orderItems);
        Order saved = orderRepository.save(order);
        cartService.clearCart(request.getUserId());
        log.info("Order {} placed for user {}", saved.getId(), user.getId());
        return toResponse(saved);
    }

    @Override @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        return toResponse(orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id)));
    }

    @Override @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
        try {
            order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Invalid order status: " + status);
        }
        return toResponse(orderRepository.save(order));
    }

    private OrderResponse toResponse(Order o) {
        OrderResponse r = new OrderResponse();
        r.setId(o.getId());
        r.setUserId(o.getUser().getId());
        r.setUserName(o.getUser().getName());
        r.setTotalAmount(o.getTotalAmount());
        r.setStatus(o.getStatus().name());
        r.setShippingAddress(o.getShippingAddress());
        r.setCreatedAt(o.getCreatedAt());
        List<OrderItemResponse> items = o.getItems().stream().map(item -> {
            OrderItemResponse ir = new OrderItemResponse();
            ir.setId(item.getId());
            ir.setProductId(item.getProduct().getId());
            ir.setProductName(item.getProduct().getName());
            ir.setProductImage(item.getProduct().getImageUrl());
            ir.setQuantity(item.getQuantity());
            ir.setUnitPrice(item.getUnitPrice());
            ir.setSubtotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            return ir;
        }).collect(Collectors.toList());
        r.setItems(items);
        return r;
    }
}
