package com.example.gmall.controller;

import com.example.gmall.dto.cart.CartItemRequestDTO;
import com.example.gmall.dto.cart.CartItemResponseDTO;
import com.example.gmall.dto.cart.CartSummaryDTO;
import com.example.gmall.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartSummaryDTO> getCart(Authentication authentication) {
        Long memberId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(cartService.getCartItems(memberId));
    }

    @PostMapping
    public ResponseEntity<CartItemResponseDTO> addItem(
            Authentication authentication,
            @RequestBody CartItemRequestDTO dto) {
        Long memberId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(cartService.addItem(memberId, dto));
    }

    @PatchMapping("/{cartItemId}")
    public ResponseEntity<CartItemResponseDTO> updateQuantity(
            Authentication authentication,
            @PathVariable("cartItemId") Long cartItemId,
            @RequestBody CartItemRequestDTO dto) {
        Long memberId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(cartService.updateQuantity(memberId, cartItemId, dto));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeItem(
            Authentication authentication,
            @PathVariable("cartItemId") Long cartItemId) {
        Long memberId = (Long) authentication.getPrincipal();
        cartService.removeItem(memberId, cartItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        Long memberId = (Long) authentication.getPrincipal();
        cartService.clearCart(memberId);
        return ResponseEntity.noContent().build();
    }
}