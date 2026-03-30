package com.example.gmall.service;

import java.util.List;

import com.example.gmall.dto.order.OrderRequestDTO;
import com.example.gmall.dto.order.OrderResponseDTO;

public interface OrderService {
	
	// 주문 생성
    // 장바구니 → 주문, 바로 구매 → 주문 둘 다 사용
    OrderResponseDTO createOrder(Long memberId, OrderRequestDTO dto);

    // 주문 목록 조회 (회원)
    List<OrderResponseDTO> getOrders(Long memberId);

    // 주문 상세 조회
    OrderResponseDTO getOrder(Long memberId, Long orderId);

    // 주문 취소
    void cancelOrder(Long memberId, Long orderId);
	
}
