package com.example.gmall.dto;

import lombok.Getter;

@Getter
public class CartItemRequestDTO {
	// 장바구니 상품 추가/수량 변경
	
	private Long productId;
	
	private int quantity;
	
}
