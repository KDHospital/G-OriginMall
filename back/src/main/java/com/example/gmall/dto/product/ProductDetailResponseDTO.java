package com.example.gmall.dto.product;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.example.gmall.domain.Member;
import com.example.gmall.domain.Product;
import com.example.gmall.domain.ProductImage;

public class ProductDetailResponseDTO {
	private Long productId;
    private String pname;
    private String pdesc;
	private Integer listPrice;
	private Integer discountPrice;
	private Integer price;
	private Integer stock;
	private Integer deliveryFee;
	private String thumbnailImageUrl;
	private Byte soldStatus;
	private boolean isCertified;
	private Integer categoryId;
	private String categoryName;
	private Long sellerId;
	private List<String> imageUrls;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	
	
    public ProductDetailResponseDTO(Product p) {
        this.productId         = p.getProductId();
        this.pname             = p.getPname();
        this.pdesc             = p.getPdesc();
        this.listPrice         = p.getListPrice();
        this.discountPrice     = p.getDiscountPrice();
        this.price             = p.getPrice();
        this.stock             = p.getStock();
        this.deliveryFee       = p.getDeliveryFee();
        this.thumbnailImageUrl = p.getThumbnailImageUrl();
        this.soldStatus        = p.getSoldStatus();
        this.isCertified       = p.isCertified();
        this.categoryId        = p.getCategory().getCategoryId();
        this.categoryName      = p.getCategory().getCategoryName();
        this.sellerId          = p.getSeller().getId();
        this.imageUrls         = p.getProductImages().stream()
					                .map(img -> img.getImageUrl())
					                .collect(Collectors.toList());
        this.createdAt         = p.getCreatedAt();
        this.updatedAt         = p.getUpdatedAt();
    }
}
