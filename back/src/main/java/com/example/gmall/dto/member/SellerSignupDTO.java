package com.example.gmall.dto.member;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SellerSignupDTO {

	@NotBlank(message = "아이디(이메일)를 입력해주세요")
	@Email(message = "올바른 이메일 형식이 아닙니다.")
	@Size(max = 30, message = "아이디는 30자 이하로 입력해주세요")
	private String loginId;
	@NotBlank(message = "비밀번호를 입력해주세요.")
    @Pattern(
        regexp = "^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*]).{8,20}$",
        message = "비밀번호는 8~20자이며 영문과 숫자 또는 특수문자를 포함해야 합니다.")
    private String mpwd;

    @NotBlank(message = "이름(담당자명)을 입력해주세요.")
    @Size(max = 15, message = "이름은 15자 이하로 입력해주세요.")
    private String mname;

    @NotBlank(message = "연락처를 입력해주세요.")
    @Pattern(regexp = "^01(?:0|1|[6-9])\\d{7,8}$", message = "연락처 형식(-제외)이 올바르지 않습니다.")
    private String tel;

   

    @NotNull(message = "성별을 선택해주세요.")
    private Byte gender; // 0=미지정, 1=남, 2=여
    
    @NotBlank(message = "사업자 등록번호를 입력해주세요.")
    @Size(max = 15, message = "사업자 번호는 15자 이하로 입력해주세요.")
    @Pattern(regexp = "^\\d{10}$", message = "사업자 번호는 하이픈(-) 없이 10자리 숫자여야 합니다.")
    private String businessNo;

    @NotNull(message = "세금계산서 발행 여부를 선택해주세요.")
    private Boolean taxInvoice; // true=발행, false=미발행

    @Size(max = 50, message = "현금영수증 번호는 50자 이하로 입력해주세요.")
    private String cashReceiptNo; 
    
    @NotBlank(message = "예금주 명을 입력해주세요.")
    @Size(max = 50, message = "예금주 명은 50자 이하로 입력해주세요.")
    private String settlementName;

    @NotBlank(message = "정산 은행을 입력해주세요.")
    @Size(max = 50, message = "은행명은 50자 이하로 입력해주세요.")
    private String settlementBank;

    @NotBlank(message = "정산 계좌번호를 입력해주세요.")
    @Size(max = 50, message = "계좌번호는 50자 이하로 입력해주세요.")
    @Pattern(regexp = "^[0-9\\-]+$", message = "계좌번호는 숫자와 하이픈(-)만 가능합니다.")
    private String bankAccount;
    
    @NotNull(message = "특산물 인증 여부를 선택해주세요.")
    private Boolean isVerified;
    
    private String description;
    
    private final Byte role = 1;
}
