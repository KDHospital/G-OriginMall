package com.example.gmall.service.impl;

import com.example.gmall.domain.CartItem;
import com.example.gmall.domain.Member;
import com.example.gmall.domain.Product;
import com.example.gmall.dto.CartItemRequestDTO;
import com.example.gmall.dto.CartItemResponseDTO;
import com.example.gmall.dto.CartSummaryDTO;
import com.example.gmall.repository.CartItemRepository;
import com.example.gmall.repository.MemberRepository;
import com.example.gmall.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;

    // ✅ 장바구니 조회
    @Transactional(readOnly = true)
    public CartSummaryDTO getCartItems(Long memberId) {
        List<CartItemResponseDTO> dtoList = cartItemRepository.findByMemberId(memberId)
                .stream()
                .map(CartItemResponseDTO::new)
                .collect(Collectors.toList());
        return new CartSummaryDTO(dtoList);
    }

    // ✅ 상품 추가 (이미 담긴 상품이면 수량 누적)
    public CartItemResponseDTO addItem(Long memberId, CartItemRequestDTO dto) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));

        CartItem cartItem = cartItemRepository
                .findByMemberIdAndProductProductId(memberId, dto.getProductId())
                .orElse(null);

        if (cartItem == null) {
            cartItem = CartItem.builder()
                    .member(member)
                    .product(product)
                    .quantity(dto.getQuantity())
                    .build();
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + dto.getQuantity());
        }

        cartItemRepository.save(cartItem);
        return new CartItemResponseDTO(cartItem);
    }

    // 수량 변경
    public CartItemResponseDTO updateQuantity(Long memberId, Long cartItemId, CartItemRequestDTO dto) {
        CartItem cartItem = getCartItemOfMember(memberId, cartItemId);
        cartItem.setQuantity(dto.getQuantity());
        return new CartItemResponseDTO(cartItem);
    }

    // 개별 삭제
    public void removeItem(Long memberId, Long cartItemId) {
        CartItem cartItem = getCartItemOfMember(memberId, cartItemId);
        cartItemRepository.delete(cartItem);
    }

    // 전체 비우기
    public void clearCart(Long memberId) {
        cartItemRepository.deleteAll(
                cartItemRepository.findByMemberId(memberId)
        );
    }

    // 공통: 본인 소유 항목인지 검증
    private CartItem getCartItemOfMember(Long memberId, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 항목이 없습니다."));
        if (!cartItem.getMember().getId().equals(memberId)) {
            throw new SecurityException("본인의 장바구니만 수정할 수 있습니다.");
        }
        return cartItem;
    }
}