package com.example.gmall.dto.product;

import java.time.LocalDateTime;

import com.example.gmall.domain.Product;

import lombok.Getter;

@Getter
public class ProductListResponseDTO {
	//상품 아이디, 상품명, 정가(리스트프라이스), 할인가, 판매가, 재고,배송비
	private Long productId;
	private String pname;
	private Integer listprice;
	private Integer discountPrice;
	private Integer price;
	private Integer stock;
	private Integer deliveryFee;
	//대표이미지url,판매상태,김포시인증여부
	private String thumbnailImageUrl;
	private Byte soldStatus;
	private boolean isCertified;
	//카테고리 id,카테고리 명, 생성일시 
	private Integer categoryId;
	private String name;
	private LocalDateTime createdAt;
	
	public ProductListResponseDTO(Product p) {
		this.productId = p.getProductId();
		this.pname = p.getPname();
		this.listprice = p.getListPrice();
		this.discountPrice = p.getDiscountPrice();
		this.price = p.getPrice();
		this.stock = p.getStock();
		this.deliveryFee = p.getDeliveryFee();
		this.thumbnailImageUrl = p.getThumbnailImageUrl();
		this.soldStatus = p.getSoldStatus();
		this.isCertified = p.isCertified();
		this.categoryId = p.getCategory().getCategoryId();
		this.name = p.getCategory().getName();
		this.createdAt = p.getCreatedAt();
	}
	
}
