package com.example.gmall.dto.order;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OrderRequestDTO {
	
	// 주문 상품 목록
    private List<OrderItemRequestDTO> orderItems;

    // 배송지 정보
    private String receiverName;
    private String receiverTel;
    private String zipcode;
    private String address;
    private String addressDetail;

    // 배송 요청사항
    private String deliveryMemo;

    // 결제 수단
    private String paymentMethod;

    // 주문 상품 내부 DTO
    @Getter
    @Setter
    public static class OrderItemRequestDTO {
        private Long productId;
        private int quantity;
    }
	
	
}
