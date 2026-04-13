package com.example.gmall.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private Member seller;

    @Column(name = "pname", length = 100, nullable = false)
    private String pname;

    @Column(name = "pdesc", columnDefinition = "TEXT")
    private String pdesc;

    @Column(name = "list_price", nullable = false)
    private Integer listPrice;

    @Builder.Default
    @Column(name = "discount_price", columnDefinition = "INT DEFAULT 0")
    private Integer discountPrice = 0;

    @Column(name = "price", nullable = false)
    private Integer price;

    @Builder.Default
    @Column(name = "stock", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer stock = 0;

    @Builder.Default
    @Column(name = "delivery_fee", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer deliveryFee = 0;

    @Column(name = "thumbnail_image_url", length = 255)
    private String thumbnailImageUrl;

    // 0=ACTIVE, 1=HIDDEN, 2=SOLD_OUT, 3=DELETED
    @Builder.Default
    @Column(name = "sold_status", nullable = false, columnDefinition = "TINYINT DEFAULT 0")
    private Byte soldStatus = 0;

    // 금빛나루 전용관 - 김포시 인증 특산물 (인증된 판매자만 등록 가능)
    @Builder.Default
    @Column(name = "is_certified", columnDefinition = "BOOLEAN DEFAULT 0")
    private boolean isCertified = false;

    // 기획전 - Admin이 디지털 취약 판매자 대신 등록/강조
    @Builder.Default
    @Column(name = "is_exhibition", columnDefinition = "BOOLEAN DEFAULT 0")
    private boolean isExhibition = false;

    @Column(name = "created_at", updatable = false, columnDefinition = "DATETIME DEFAULT NOW()")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "DATETIME DEFAULT NOW()")
    private LocalDateTime updatedAt;

    @Builder.Default
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> productImages = new ArrayList<>();

    // ── 상품 수정 ────────────────────────────────────────────────────
    public void updateProduct(String pname, String pdesc, Category category,
                              Integer listPrice, Integer discountPrice, Integer price,
                              Integer stock, Integer deliveryFee) {
        this.pname = pname;
        this.pdesc = pdesc;
        this.category = category;
        this.listPrice = listPrice;
        this.discountPrice = discountPrice;
        this.price = price;
        this.stock = stock;
        this.deliveryFee = deliveryFee;
    }

    // ── 판매 상태 변경 (0=ACTIVE, 1=HIDDEN, 2=SOLD_OUT, 3=DELETED) ─────────────
    public void updateSoldStatus(Byte soldStatus) {
        this.soldStatus = soldStatus;
    }

    // ── 재고 차감 (주문 생성 시 재고 차감) ──────────────────────────────────────
    public void decreaseStock(Integer quantity) {
        if (this.stock < quantity) {
            throw new IllegalStateException("재고가 부족합니다.");
        }
        this.stock -= quantity;
    }

    // ── 썸네일 이미지 변경 ────────────────────────────────────────────
    public void updateThumbnailImageUrl(String thumbnailImageUrl) {
        this.thumbnailImageUrl = thumbnailImageUrl;
    }

    // ── 금빛나루 인증 설정/해제 ───────────────────────────────────────
    public void updateIsCertified(boolean isCertified) {
        this.isCertified = isCertified;
    }

    // ── 기획전 설정/해제 (Admin 전용) ─────────────────────────────────
    public void updateIsExhibition(boolean isExhibition) {
        this.isExhibition = isExhibition;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // -- 재고 차감에 대한 로직(주문 취소시 복구)
    public void restoreStock(Integer quantity) {
    	this.stock += quantity;
    }
    //재고 0이면 품절처리 로직 추가
    public void setStock(int remainStock) {
    	this.stock = remainStock;
    }
    public void setSoldStatus(Byte soldStatus) {
    	this.soldStatus = soldStatus;
    }
}
