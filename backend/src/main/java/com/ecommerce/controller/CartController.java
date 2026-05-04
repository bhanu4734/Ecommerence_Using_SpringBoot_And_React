package com.ecommerce.controller;

import com.ecommerce.dto.request.CartItemRequest;
import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.CartResponse;
import com.ecommerce.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart APIs")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    @Operation(summary = "Get cart for user")
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(cartService.getCartByUserId(userId)));
    }

    @PostMapping("/{userId}/items")
    @Operation(summary = "Add item to cart")
    public ResponseEntity<ApiResponse<CartResponse>> addItem(
            @PathVariable Long userId, @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", cartService.addItemToCart(userId, request)));
    }

    @PutMapping("/{userId}/items/{itemId}")
    @Operation(summary = "Update cart item quantity")
    public ResponseEntity<ApiResponse<CartResponse>> updateItem(
            @PathVariable Long userId, @PathVariable Long itemId, @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Cart updated", cartService.updateCartItem(userId, itemId, request)));
    }

    @DeleteMapping("/{userId}/items/{itemId}")
    @Operation(summary = "Remove item from cart")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @PathVariable Long userId, @PathVariable Long itemId) {
        return ResponseEntity.ok(ApiResponse.success("Item removed", cartService.removeItemFromCart(userId, itemId)));
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Clear cart")
    public ResponseEntity<ApiResponse<Void>> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared"));
    }
}
