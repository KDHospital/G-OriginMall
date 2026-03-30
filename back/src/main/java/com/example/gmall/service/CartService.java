package com.example.gmall.service;

import com.example.gmall.dto.cart.CartItemRequestDTO;
import com.example.gmall.dto.cart.CartItemResponseDTO;
import com.example.gmall.dto.cart.CartSummaryDTO;

public interface CartService {
	
	CartSummaryDTO getCartItems(Long memberId);

    CartItemResponseDTO addItem(Long memberId, CartItemRequestDTO dto);

    CartItemResponseDTO updateQuantity(Long memberId, Long cartItemId, CartItemRequestDTO dto);

    void removeItem(Long memberId, Long cartItemId);

    void clearCart(Long memberId);

}
