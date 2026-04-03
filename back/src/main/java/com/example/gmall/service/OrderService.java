package com.example.gmall.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.gmall.dto.order.OrderRequestDTO;
import com.example.gmall.dto.order.OrderResponseDTO;

public interface OrderService {
	
	// 주문 생성 (판매자별 분리 → List 반환)
    List<OrderResponseDTO> createOrder(Long memberId, OrderRequestDTO dto);

    // 주문 목록 조회 (회원)
    Page<OrderResponseDTO> getOrders(Long memberId, Pageable pageable);

    // 주문 상세 조회
    OrderResponseDTO getOrder(Long memberId, Long orderId);

    // 주문 전체 취소
    void cancelOrder(Long memberId, Long orderId);

    // 주문 상품 개별 취소
    void cancelOrderItem(Long memberId, Long orderId, Long orderItemId);
    
    // TossPayment API 연동
    void confirmPayment(Long memberId, Long orderId, String tossOrderId, String paymentKey, Long amount);
	
}
