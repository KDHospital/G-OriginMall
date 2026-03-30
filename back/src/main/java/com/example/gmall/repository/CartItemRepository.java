package com.example.gmall.repository;

import com.example.gmall.domain.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // 특정 회원의 장바구니 전체 조회
    List<CartItem> findByMemberId(Long memberId);

    // 특정 회원 + 특정 상품 (중복 담기 체크용)
    // Member.Id + Product.ProductId
    Optional<CartItem> findByMemberIdAndProductProductId(Long memberId, Long productId);

    // 특정 회원 장바구니 전체 삭제 (주문 완료 시)
    void deleteByMemberId(Long memberId);

    // 장바구니 상품 수 (뱃지 표시용)
    int countByMemberId(Long memberId);
}
