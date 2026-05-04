package com.ecommerce.service;

import com.ecommerce.dto.request.OrderRequest;
import com.ecommerce.dto.response.OrderResponse;
import java.util.List;

public interface OrderService {
    OrderResponse placeOrder(OrderRequest request);
    OrderResponse getOrderById(Long id);
    List<OrderResponse> getOrdersByUserId(Long userId);
    List<OrderResponse> getAllOrders();
    OrderResponse updateOrderStatus(Long id, String status);
}
