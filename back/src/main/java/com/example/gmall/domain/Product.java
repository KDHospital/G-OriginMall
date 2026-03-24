package com.example.gmall.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product")
@Getter
@NoArgsConstructor
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
 
    // 고도화 후순위
    @Column(name = "origin", length = 50)
    private String origin;
 
    @Column(name = "weight_unit", length = 5)
    private String weightUnit;
 
    @Column(name = "harvest_year", length = 5)
    private String harvestYear;
 
    @Column(name = "list_price", nullable = false)
    private Integer listPrice;
 
    @Column(name = "discount_price", columnDefinition = "INT DEFAULT 0")
    private Integer discountPrice = 0;
 
    @Column(name = "price", nullable = false)
    private Integer price;
 
    @Column(name = "stock", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer stock = 0;
 
    @Column(name = "delivery_fee", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer deliveryFee = 0;
 
    @Column(name = "thumbnail_image_url", length = 255)
    private String thumbnailImageUrl;
 
    // 0=ACTIVE, 1=HIDDEN, 2=SOLD_OUT
    @Column(name = "sold_status", nullable = false, columnDefinition = "TINYINT DEFAULT 0")
    private Byte soldStatus = 0;
 
    // 금빛나루 전용관
    @Column(name = "is_certified", columnDefinition = "BOOLEAN DEFAULT 0")
    private boolean isCertified = false;
 
    @Column(name = "created_at", updatable = false, columnDefinition = "DATETIME DEFAULT NOW()")
    private LocalDateTime createdAt;
 
    @Column(name = "updated_at", columnDefinition = "DATETIME DEFAULT NOW()")
    private LocalDateTime updatedAt;
 
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> productImages = new ArrayList<>();
 
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
 
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
