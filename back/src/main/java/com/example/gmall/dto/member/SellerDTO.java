package com.example.gmall.dto.member;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SellerDTO {

	// 회원 기본 정보
    private Long id;
    private String loginId;
    private String mname;
    private String tel;
    private String email;

    // 사업자 정보
    private String businessNo;
    private Boolean taxInvoice;
    private String cashReceiptNo;
    private Boolean isVerified; // 특산물 인증 여부

    // 정산 정보
    private String settlementName;
    private String settlementBank;
    private String bankAccount;

    // 상태 정보
    private boolean businessVerified; // 승인 여부
    private Byte role; // 1: SELLER
    private LocalDateTime createdAt; // 신청일
	
}
