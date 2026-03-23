package com.example.gmall.dto;

import com.example.gmall.domain.CartItem;

import lombok.Getter;

@Getter
public class CartItemResponseDTO {
	// 장바구니 조회 응답
	
	private Long cartItemId;
	
	private Long productId;
	
	private Long sellerId;
	
	private String sellerName;
	
	private String pname;
	
	private Integer listPrice;
	
	private Integer discountPrice;
	
	private Integer price;
	
	private Integer deliveryFee;
	
	private int quantity;
	
	private Integer itemSubtotal; // price * quantity (배송비 제외 -> 동일 판매처 경우 중복 배송비 제거하기 위함)
	
	public CartItemResponseDTO(CartItem cartItem) {
        this.cartItemId = cartItem.getCartItemId();
        this.productId = cartItem.getProduct().getProductId();
        this.sellerId = cartItem.getProduct().getSeller().getId();
        
        // settlementName(정산용 이름) 없으면 mname(회원이름)으로 받음
        this.sellerName = cartItem.getProduct().getSeller().getSettlementName() != null
                ? cartItem.getProduct().getSeller().getSettlementName()
                : cartItem.getProduct().getSeller().getMname();
        
        this.pname = cartItem.getProduct().getPname();
        this.listPrice = cartItem.getProduct().getListPrice();
        this.discountPrice = cartItem.getProduct().getDiscountPrice();
        this.price = cartItem.getProduct().getPrice();
        this.deliveryFee = cartItem.getProduct().getDeliveryFee();
        this.quantity = cartItem.getQuantity();
        this.itemSubtotal = this.price * this.quantity; // 배송비 제외 -> 동일 판매처 경우 중복 배송비 제거하기 위함
    }
	
}
