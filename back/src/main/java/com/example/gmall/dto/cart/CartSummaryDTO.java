package com.example.gmall.dto.cart;

import java.util.List;
import java.util.stream.Collectors;

import lombok.Getter;

@Getter
public class CartSummaryDTO {
	// 장바구니 금액 합산 및 판매자별 그룹핑(배달비 중복 합산 방지)
	
	private List<CartItemResponseDTO> items;
	
	// 장바구니 물품의 총 합산
	private Integer totalItemPrice;
	
	// 장바구니 물품의 배달비 총 합산
	private Integer totalDeliveryFee;
	
	// 총 합산
	private Integer totalPrice;
	
	public CartSummaryDTO(List<CartItemResponseDTO> items) {
		this.items = items;
		
		// 장바구니 물품의 총 합산
		this.totalItemPrice = items.stream()
				.mapToInt(CartItemResponseDTO::getItemSubtotal)
				.sum();
		
		// 판매자별 그룹핑 -> 판매자당 배달비 1회만 합산.
		this.totalDeliveryFee = items.stream()
				.collect(Collectors.toMap(
						CartItemResponseDTO::getSellerId,
						CartItemResponseDTO::getDeliveryFee,
						(existing, duplicate) -> existing
				))
				.values().stream()
				.mapToInt(Integer::intValue)
				.sum();
		// existing, duplicate 는 중복된 값이 나온 경우
		// -> existing 기존의 값을 선택
		// -> duplicate 나중에 나온 값을 선택
		
		this.totalPrice = this.totalItemPrice + this.totalDeliveryFee;
	}
	
	
}
