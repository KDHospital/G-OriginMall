package com.example.gmall.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserSignupDTO {

	@NotBlank(message = "아이디(이메일)를 입력해주새요.")
	@Email(message = "올바른 이메일 형식이 아닙니다.")
	@Size(max = 50,message = "이메일은 50자 이하로 입력해주세요")
	private String loginId;
	
	@NotBlank(message = "비밀번호를 입력해주세요")
	@Pattern(
			regexp = "^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*]).{8,20}$",
			message = "비밀번호는 8~20자이며 영문과 숫자 또는 특수문자(!@#$%^&*)를 포함해야 합니다.")
	private String mpwd;
	
	@NotBlank(message = "이름을 입력해주세요")
	@Size(max = 15, message = "이름은 15자 이하로 입력해주세요")
	private String mname;
	
	@NotBlank(message = "연락처를 입력해주세요")
	@Size(max = 15, message = "연락처는 15자 이하로 입력해주세요")
	@Pattern(
			regexp = "^01(?:0|1|[6-9])\\d{7,8}$",message = "연락처는 '01012345678' 형식의 숫자만 입력해주세요.")
	private String tel;
	
	@NotNull(message = "성별을 선택해주세요.")
	private Byte gender; // 0: 미지정 , 1: 남성 , 2: 여성
	
	private String verificationCode;
}
