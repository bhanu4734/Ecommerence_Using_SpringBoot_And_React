package com.ecommerce.service.impl;

import com.ecommerce.dto.request.CartItemRequest;
import com.ecommerce.dto.response.CartItemResponse;
import com.ecommerce.dto.response.CartResponse;
import com.ecommerce.entity.*;
import com.ecommerce.exception.BusinessException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.*;
import com.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Slf4j @Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public CartResponse getCartByUserId(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return toResponse(cart);
    }

    @Override
    public CartResponse addItemToCart(Long userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", request.getProductId()));

        if (!product.getActive()) throw new BusinessException("Product is not available");
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BusinessException("Insufficient stock. Available: " + product.getStockQuantity());
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQty = item.getQuantity() + request.getQuantity();
            if (product.getStockQuantity() < newQty) {
                throw new BusinessException("Insufficient stock. Available: " + product.getStockQuantity());
            }
            item.setQuantity(newQty);
            cartItemRepository.save(item);
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart).product(product).quantity(request.getQuantity()).build();
            cart.getItems().add(item);
        }
        cart.recalculateTotal();
        return toResponse(cartRepository.save(cart));
    }

    @Override
    public CartResponse updateCartItem(Long userId, Long itemId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", itemId));

        Product product = item.getProduct();
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BusinessException("Insufficient stock. Available: " + product.getStockQuantity());
        }
        item.setQuantity(request.getQuantity());
        cart.recalculateTotal();
        return toResponse(cartRepository.save(cart));
    }

    @Override
    public CartResponse removeItemFromCart(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        cart.recalculateTotal();
        return toResponse(cartRepository.save(cart));
    }

    @Override
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", userId));
            Cart cart = Cart.builder().user(user).build();
            return cartRepository.save(cart);
        });
    }

    private CartResponse toResponse(Cart cart) {
        CartResponse r = new CartResponse();
        r.setId(cart.getId());
        r.setUserId(cart.getUser().getId());
        r.setTotalAmount(cart.getTotalAmount());
        r.setItemCount(cart.getItems().size());
        List<CartItemResponse> items = cart.getItems().stream().map(item -> {
            CartItemResponse ir = new CartItemResponse();
            ir.setId(item.getId());
            ir.setProductId(item.getProduct().getId());
            ir.setProductName(item.getProduct().getName());
            ir.setProductImage(item.getProduct().getImageUrl());
            ir.setUnitPrice(item.getProduct().getPrice());
            ir.setQuantity(item.getQuantity());
            ir.setSubtotal(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            return ir;
        }).collect(Collectors.toList());
        r.setItems(items);
        return r;
    }
}
