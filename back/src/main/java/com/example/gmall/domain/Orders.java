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
import lombok.Setter;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
public class Orders {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private Member seller;
 
    @Column(name = "total_price", nullable = false)
    private Integer totalPrice;
 
    // 0=결제전, 1=상품준비중, 2=배송중, 3=배송완료, 4=취소/환불
    @Column(name = "status", nullable = false, columnDefinition = "TINYINT DEFAULT 0")
    private Byte status = 0;
 
    @Column(name = "receiver_name", length = 50, nullable = false)
    private String receiverName;
 
    @Column(name = "receiver_tel", length = 15, nullable = false)
    private String receiverTel;
 
    @Column(name = "zipcode", length = 10, nullable = false)
    private String zipcode;
 
    @Column(name = "address", length = 100, nullable = false)
    private String address;
 
    @Column(name = "address_detail", length = 100)
    private String addressDetail;
 
    // 토스 API 후순위
    @Column(name = "payment_key", length = 200)
    private String paymentKey;
 
    @Column(name = "payment_method", length = 30)
    private String paymentMethod;
 
    @Column(name = "paid_at")
    private LocalDateTime paidAt;
 
    @Column(name = "created_at", updatable = false, columnDefinition = "DATETIME DEFAULT NOW()")
    private LocalDateTime createdAt;
 
    @Column(name = "updated_at", columnDefinition = "DATETIME DEFAULT NOW()")
    private LocalDateTime updatedAt;
 
    @OneToMany(mappedBy = "orders", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();
 
    @OneToMany(mappedBy = "orders", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderStatusHistory> statusHistories = new ArrayList<>();
 
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