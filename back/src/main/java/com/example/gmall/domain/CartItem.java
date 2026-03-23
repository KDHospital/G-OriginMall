package com.example.gmall.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "cart_item")
@Getter
@Setter
@NoArgsConstructor
public class CartItem {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartItemId;

    // 회원당 장바구니 1개 구조 (cart 테이블 없이 member_id 직접 연결)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "quantity", nullable = false, columnDefinition = "INT DEFAULT 1")
    private Integer quantity = 1;

    @Column(name = "created_at", updatable = false, columnDefinition = "DATETIME DEFAULT NOW()")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

}
