package com.example.gmall.dto.product;

import java.time.LocalDateTime;

import com.example.gmall.domain.Product;

import lombok.Getter;

@Getter
public class ProductListResponseDTO {
	//상품 아이디, 상품명, 정가(리스트프라이스), 할인가, 판매가, 재고,배송비
	private Long productId;
	private String pname;
	private Integer listPrice;
	private Integer discountPrice;
	private Integer price;
	private Integer stock;
	private Integer deliveryFee;
	//대표이미지url,판매상태,김포시인증여부,기획전 여부
	private String thumbnailImageUrl;
	private Byte soldStatus;
	private boolean isCertified;
	private boolean isExhibition;
	//카테고리 id,카테고리 명, 생성일시 
	private Integer categoryId;
	private String categoryName;
	private LocalDateTime createdAt;
	private String sellerName;
	
	public ProductListResponseDTO(Product p) {
		this.productId = p.getProductId();
		this.pname = p.getPname();
		this.listPrice = p.getListPrice();
		this.discountPrice = p.getDiscountPrice();
		this.price = p.getPrice();
		this.stock = p.getStock();
		this.deliveryFee = p.getDeliveryFee();
		this.thumbnailImageUrl = p.getThumbnailImageUrl();
		this.soldStatus = p.getSoldStatus();
		this.isCertified = p.isCertified();
		this.isExhibition = p.isExhibition();
		this.categoryId = p.getCategory().getCategoryId();
		this.categoryName = p.getCategory().getCategoryName();
		this.createdAt = p.getCreatedAt();
		this.sellerName = p.getSeller().getMname();
	}
	
}
