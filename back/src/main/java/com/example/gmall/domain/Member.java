package com.example.gmall.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "member")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    @Column(name = "login_id", length = 30, unique = true, nullable = false)
    private String loginId;
 
    @Column(name = "mname", length = 15, nullable = false)
    private String mname;
 
    @Column(name = "mpwd", length = 255)
    private String mpwd; // 소셜 로그인 시 NULL 허용
 
    @Column(name = "tel", length = 15, nullable = false)
    private String tel;
 
    @Column(name = "email", length = 50, nullable = false)
    private String email;
 
    //이메일 인증 여부
    @Column(name = "email_verified", nullable = false, columnDefinition = "BOOLEAN DEFAULT 0")
    private boolean emailVerified = false;
 
    @Column(name = "gender")
    private Byte gender; // 0=미지정, 1=남, 2=여
 
    // 0=USER, 1=SELLER, 2=ADMIN
    @Column(name = "role", nullable = false, columnDefinition = "TINYINT DEFAULT 0")
    private Byte role = 0;
 
    // 판매자 전용 필드
    @Column(name = "business_no", length = 15)
    private String businessNo;
 
    @Column(name = "business_verified", columnDefinition = "BOOLEAN DEFAULT 0")
    private boolean businessVerified = false;
 
    @Column(name = "tax_invoice", columnDefinition = "BOOLEAN DEFAULT 0")
    private boolean taxInvoice = false;
 
    @Column(name = "cash_receipt_no", length = 50)
    private String cashReceiptNo;
 
    @Column(name = "is_verified", columnDefinition = "BOOLEAN DEFAULT 0")
    private boolean isVerified = false; // 특산물 인증 여부 (판매자)
 
    @Column(name = "withdraw_at")
    private LocalDateTime withdrawAt;
    
    @Column(name = "settlement_name", length = 50)
    private String settlementName;
 
    @Column(name = "settlement_bank", length = 50)
    private String settlementBank;
 
    @Column(name = "bank_account", length = 50)
    private String bankAccount;
 
    @Column(name = "is_deleted", nullable = false, columnDefinition = "BOOLEAN DEFAULT 0")
    private boolean isDeleted = false;
 
    @Column(name = "created_at", updatable = false, columnDefinition = "DATETIME DEFAULT NOW()")
    private LocalDateTime createdAt;
 
    @Column(name = "updated_at", columnDefinition = "DATETIME DEFAULT NOW()")
    private LocalDateTime updatedAt;
 
    // 연관관계
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Sns> snsList = new ArrayList<>();
 
    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeliveryAddress> deliveryAddresses = new ArrayList<>();
 
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
 
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    public void changeName(String mname) {this.mname = mname;}
    public void changeTel(String tel) {this.tel = tel;}
    public void changePassword(String mpwd) {this.mpwd = mpwd;}
    public void changeGender(Byte gender) {this.gender =  gender;}
    public void changeDeleteStatus(boolean isDeleted) {
    	this.isDeleted = isDeleted;
    	if(isDeleted) {
    		this.withdrawAt = LocalDateTime.now();
    	}else {
    		this.withdrawAt = null;
    	}
    }
    public void updateBusinessVerify(boolean status) {
    	this.businessVerified = status;
    }
    public void rejectBusinessVerify() {
    	this.businessVerified = false;
    }
}
