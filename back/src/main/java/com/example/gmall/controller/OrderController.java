package com.example.gmall.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.gmall.dto.order.OrderRequestDTO;
import com.example.gmall.dto.order.OrderResponseDTO;
import com.example.gmall.service.OrderService;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // 주문 생성
    // POST /api/orders
    @PostMapping("/orders")
    public ResponseEntity<List<OrderResponseDTO>> createOrder(
            @RequestBody OrderRequestDTO requestDTO,
            Authentication authentication
    ) {
        Long memberId = (Long) authentication.getPrincipal();
        List<OrderResponseDTO> result = orderService.createOrder(memberId, requestDTO);
        return ResponseEntity.ok(result);
    }

    // 주문 목록 조회
    // GET /api/orders
    @GetMapping("/orders")
    public ResponseEntity<Page<OrderResponseDTO>> getOrders(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            Authentication authentication
    ) {
        Long memberId = (Long) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponseDTO> result = orderService.getOrders(memberId, pageable);
        return ResponseEntity.ok(result);
    }

    // 주문 상세 조회
    // GET /api/orders/{orderId}
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderResponseDTO> getOrder(
            @PathVariable("orderId") Long orderId,
            Authentication authentication
    ) {
        Long memberId = (Long) authentication.getPrincipal();
        OrderResponseDTO result = orderService.getOrder(memberId, orderId);
        return ResponseEntity.ok(result);
    }

    // 주문 전체 취소
    // PATCH /api/orders/{orderId}/cancel
    @PatchMapping("/orders/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(
            @PathVariable("orderId") Long orderId,
            Authentication authentication
    ) {
        Long memberId = (Long) authentication.getPrincipal();
        orderService.cancelOrder(memberId, orderId);
        return ResponseEntity.noContent().build();
    }

    // 주문 개별 아이템 취소
    // PATCH /api/orders/{orderId}/items/{orderItemId}/cancel
    @PatchMapping("/orders/{orderId}/items/{orderItemId}/cancel")
    public ResponseEntity<Void> cancelOrderItem(
            @PathVariable("orderId") Long orderId,
            @PathVariable("orderItemId") Long orderItemId,
            Authentication authentication
    ) {
        Long memberId = (Long) authentication.getPrincipal();
        orderService.cancelOrderItem(memberId, orderId, orderItemId);
        return ResponseEntity.noContent().build();
    }
    
    // 결제 승인 DTO
    @Getter
    @Setter
    public static class ConfirmRequestDTO {
        private String tossOrderId;   // ORDER_10 형태
        private String paymentKey;
        private Long amount;
    }

    @PostMapping("/orders/{orderId}/confirm")
    public ResponseEntity<Void> confirmPayment(
            @PathVariable("orderId") Long orderId,
            @RequestBody ConfirmRequestDTO requestDTO,
            Authentication authentication
    ) {
        Long memberId = (Long) authentication.getPrincipal();
        orderService.confirmPayment(
            memberId,
            orderId,
            requestDTO.getTossOrderId(),  // 추가
            requestDTO.getPaymentKey(),
            requestDTO.getAmount()
        );
        return ResponseEntity.noContent().build();
    }
    
    
}
