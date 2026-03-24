package com.example.gmall.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "delivery_address")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addressId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "recipient_name", length = 50, nullable = false)
    private String recipientName;

    @Column(name = "recipient_phone", length = 15, nullable = false)
    private String recipientPhone;

    @Column(name = "zipcode", length = 10, nullable = false)
    private String zipcode;

    @Column(name = "address", length = 100, nullable = false)
    private String address;

    @Column(name = "address_detail", length = 100)
    private String addressDetail;

    // 단 하나의 주소만 기본 배송지로 지정 가능
    @Builder.Default
    @Column(name = "is_default", columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean isDefault = false;

    @Column(name = "memo", length = 200)
    private String memo;

    // ── 배송지 수정 메서드 ──────────────────────────────────────────────
    // 배송지 정보 일괄 수정
    public void update(String recipientName, String recipientPhone,
                       String zipcode, String address,
                       String addressDetail, String memo) {
        this.recipientName = recipientName;
        this.recipientPhone = recipientPhone;
        this.zipcode = zipcode;
        this.address = address;
        this.addressDetail = addressDetail;
        this.memo = memo;
    }

    // 기본 배송지 설정/해제
    public void updateIsDefault(boolean isDefault) {
        this.isDefault = isDefault;
    }
}
