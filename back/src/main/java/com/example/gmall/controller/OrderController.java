package com.example.gmall.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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
import com.example.gmall.dto.order.OrderStatusHistoryResponseDTO;
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
    
	 // 주문 상태 이력 조회
	 // GET /api/orders/{orderId}/history
	 @GetMapping("/orders/{orderId}/history")
	 public ResponseEntity<List<OrderStatusHistoryResponseDTO>> getOrderHistory(
	         @PathVariable("orderId") Long orderId,
	         Authentication authentication
	 ) {
	     Long memberId = (Long) authentication.getPrincipal();
	     List<OrderStatusHistoryResponseDTO> result = orderService.getOrderHistory(memberId, orderId);
	     return ResponseEntity.ok(result);
	 }
	 
	// 판매자 주문 카운트
	// GET /api/seller/orders/count
	@GetMapping("/seller/orders/count")
	public ResponseEntity<Map<String, Long>> getSellerOrderCount(
	        Authentication authentication
	) {
	    Long sellerId = (Long) authentication.getPrincipal();
	    return ResponseEntity.ok(orderService.getSellerOrderCount(sellerId));
	}

	// 기존 getSellerOrders 수정 — status 파라미터 추가
	@GetMapping("/seller/orders")
	public ResponseEntity<Page<OrderResponseDTO>> getSellerOrders(
	        @RequestParam(name = "page", defaultValue = "0") int page,
	        @RequestParam(name = "size", defaultValue = "10") int size,
	        @RequestParam(name = "status", required = false) Byte status,
	        Authentication authentication
	) {
	    Long sellerId = (Long) authentication.getPrincipal();
	    Pageable pageable = PageRequest.of(page, size);
	    Page<OrderResponseDTO> result = orderService.getSellerOrders(sellerId, status, pageable);
	    return ResponseEntity.ok(result);
	}
	
	// 판매자 주문 상세 조회 ( 판매자 검증 확인 )
	// GET /api/seller/orders/{orderId}
	@GetMapping("/seller/orders/{orderId}")
	public ResponseEntity<OrderResponseDTO> getSellerOrder(
	        @PathVariable("orderId") Long orderId,
	        Authentication authentication
	) {
	    Long sellerId = (Long) authentication.getPrincipal();
	    OrderResponseDTO result = orderService.getSellerOrder(sellerId, orderId);
	    return ResponseEntity.ok(result);
	}
    
	// 판매자 주문 상태 변경
	// PATCH /api/seller/orders/{orderId}/status
	@PatchMapping("/seller/orders/{orderId}/status")
	public ResponseEntity<Void> updateOrderStatus(
	        @PathVariable("orderId") Long orderId,
	        @RequestParam(name = "status") Byte status,
	        Authentication authentication
	) {
	    Long sellerId = (Long) authentication.getPrincipal();
	    orderService.updateOrderStatus(sellerId, orderId, status);
	    return ResponseEntity.noContent().build();
	}
    
	// 어드민 주문 카운트
	// GET /api/admin/orders/count
	@GetMapping("/admin/orders/count")
	public ResponseEntity<Map<String, Long>> getAdminOrderCount() {
	    return ResponseEntity.ok(orderService.getAdminOrderCount());
	}

	// 어드민 전체 주문 목록
	// GET /api/admin/orders
	@GetMapping("/admin/orders")
	public ResponseEntity<Page<OrderResponseDTO>> getAdminOrders(
	        @RequestParam(name = "page", defaultValue = "0") int page,
	        @RequestParam(name = "size", defaultValue = "10") int size,
	        @RequestParam(name = "status", required = false) Byte status,
	        @RequestParam(name = "keyword", required = false) String keyword,
	        @RequestParam(name = "sellerName", required = false) String sellerName,
	        @RequestParam(name = "startDate", required = false) String startDate,
	        @RequestParam(name = "endDate", required = false) String endDate
	) {
	    LocalDateTime start = startDate != null
	            ? LocalDateTime.parse(startDate + "T00:00:00") : null;
	    LocalDateTime end = endDate != null
	            ? LocalDateTime.parse(endDate + "T23:59:59") : null;

	    Pageable pageable = PageRequest.of(page, size);
	    Page<OrderResponseDTO> result = orderService.getAdminOrders(
	            status, keyword, sellerName, start, end, pageable);
	    return ResponseEntity.ok(result);
	}

	// 어드민 주문 상세
	// GET /api/admin/orders/{orderId}
	@GetMapping("/admin/orders/{orderId}")
	public ResponseEntity<OrderResponseDTO> getAdminOrder(
	        @PathVariable("orderId") Long orderId
	) {
	    return ResponseEntity.ok(orderService.getAdminOrder(orderId));
	}

	// 어드민 주문 취소
	// PATCH /api/admin/orders/{orderId}/cancel
	@PatchMapping("/admin/orders/{orderId}/cancel")
	public ResponseEntity<Void> adminCancelOrder(
	        @PathVariable("orderId") Long orderId
	) {
	    orderService.adminCancelOrder(orderId);
	    return ResponseEntity.noContent().build();
	}

	// PATCH /api/admin/orders/{orderId}/status
	@PatchMapping("/admin/orders/{orderId}/status")
	public ResponseEntity<Void> adminUpdateOrderStatus(
	        @PathVariable("orderId") Long orderId,
	        @RequestParam(name = "status") Byte status
	) {
	    orderService.adminUpdateOrderStatus(orderId, status);  // adminId 파라미터 제거
	    return ResponseEntity.noContent().build();
	}
	
	// 판매자 주문 취소
	// PATCH /api/seller/orders/{orderId}/cancel
	@PatchMapping("/seller/orders/{orderId}/cancel")
	public ResponseEntity<Void> sellerCancelOrder(
	        @PathVariable("orderId") Long orderId,
	        Authentication authentication
	) {
	    Long sellerId = (Long) authentication.getPrincipal();
	    orderService.sellerCancelOrder(sellerId, orderId);
	    return ResponseEntity.noContent().build();
	}
}
