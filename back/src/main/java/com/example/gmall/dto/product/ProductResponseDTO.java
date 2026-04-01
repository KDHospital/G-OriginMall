package com.example.gmall.dto.product;

import com.example.gmall.domain.Product;
import lombok.Getter;

@Getter
public class ProductResponseDTO {

    private Long productId;
    private String pname;
    private String pdesc;
    private Integer categoryId;
    private String categoryName;
    private Long sellerId;
    private String sellerName;
    private Integer listPrice;
    private Integer discountPrice;
    private Integer price;
    private Integer stock;
    private Integer deliveryFee;
    private String thumbnailImageUrl;
    private boolean isCertified;
    private boolean isExhibition;
    private Byte soldStatus;

    public ProductResponseDTO(Product product) {
        this.productId = product.getProductId();
        this.pname = product.getPname();
        this.pdesc = product.getPdesc();
        this.categoryId = product.getCategory().getCategoryId();
        this.categoryName = product.getCategory().getCategoryName();
        this.sellerId = product.getSeller().getId();
        this.sellerName = product.getSeller().getSettlementName() != null
                ? product.getSeller().getSettlementName()
                : product.getSeller().getMname();
        this.listPrice = product.getListPrice();
        this.discountPrice = product.getDiscountPrice();
        this.price = product.getPrice();
        this.stock = product.getStock();
        this.deliveryFee = product.getDeliveryFee();
        this.thumbnailImageUrl = product.getThumbnailImageUrl();
        this.isCertified = product.isCertified();
        this.isExhibition = product.isExhibition();
        this.soldStatus = product.getSoldStatus();
        
        // 사업자 등록 이름이 없다면 가입 시 이름으로 대체
    }
}
