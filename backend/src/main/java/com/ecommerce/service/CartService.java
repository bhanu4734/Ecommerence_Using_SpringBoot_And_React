package com.ecommerce.service;

import com.ecommerce.dto.request.CartItemRequest;
import com.ecommerce.dto.response.CartResponse;

public interface CartService {
    CartResponse getCartByUserId(Long userId);
    CartResponse addItemToCart(Long userId, CartItemRequest request);
    CartResponse updateCartItem(Long userId, Long itemId, CartItemRequest request);
    CartResponse removeItemFromCart(Long userId, Long itemId);
    void clearCart(Long userId);
}
