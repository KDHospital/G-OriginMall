package com.example.gmall.controller;

import com.example.gmall.dto.cart.CartItemRequestDTO;
import com.example.gmall.dto.cart.CartItemResponseDTO;
import com.example.gmall.dto.cart.CartSummaryDTO;
import com.example.gmall.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// ── JWT 적용 후 추가할 import ──────────────────────────────────────────────
// import com.example.gmall.security.CustomUserDetails;
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
// ──────────────────────────────────────────────────────────────────────────

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // 장바구니 조회
    @GetMapping
    public ResponseEntity<CartSummaryDTO> getCart(
            @RequestParam Long memberId
            // ── JWT 적용 후 교체 ──────────────────────────────────────────
            // @AuthenticationPrincipal CustomUserDetails userDetails
            // Long memberId = userDetails.getId();
            // ─────────────────────────────────────────────────────────────
    ) {
        return ResponseEntity.ok(cartService.getCartItems(memberId));
    }

    // 상품 추가
    @PostMapping
    public ResponseEntity<CartItemResponseDTO> addItem(
            @RequestParam Long memberId,
            // ── JWT 적용 후 교체 ──────────────────────────────────────────
            // @AuthenticationPrincipal CustomUserDetails userDetails
            // Long memberId = userDetails.getId();
            // ─────────────────────────────────────────────────────────────
            @RequestBody CartItemRequestDTO dto
    ) {
        return ResponseEntity.ok(cartService.addItem(memberId, dto));
    }

    // 수량 변경
    @PatchMapping("/{cartItemId}")
    public ResponseEntity<CartItemResponseDTO> updateQuantity(
            @RequestParam Long memberId,
            // ── JWT 적용 후 교체 ──────────────────────────────────────────
            // @AuthenticationPrincipal CustomUserDetails userDetails
            // Long memberId = userDetails.getId();
            // ─────────────────────────────────────────────────────────────
            @PathVariable Long cartItemId,
            @RequestBody CartItemRequestDTO dto
    ) {
        return ResponseEntity.ok(cartService.updateQuantity(memberId, cartItemId, dto));
    }

    // 개별 삭제
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeItem(
            @RequestParam Long memberId,
            // ── JWT 적용 후 교체 ──────────────────────────────────────────
            // @AuthenticationPrincipal CustomUserDetails userDetails
            // Long memberId = userDetails.getId();
            // ─────────────────────────────────────────────────────────────
            @PathVariable Long cartItemId
    ) {
        cartService.removeItem(memberId, cartItemId);
        return ResponseEntity.noContent().build();
    }

    // 전체 비우기
    @DeleteMapping
    public ResponseEntity<Void> clearCart(
            @RequestParam Long memberId
            // ── JWT 적용 후 교체 ──────────────────────────────────────────
            // @AuthenticationPrincipal CustomUserDetails userDetails
            // Long memberId = userDetails.getId();
            // ─────────────────────────────────────────────────────────────
    ) {
        cartService.clearCart(memberId);
        return ResponseEntity.noContent().build();
    }
}