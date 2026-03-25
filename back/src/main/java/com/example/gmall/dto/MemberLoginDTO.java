package com.example.gmall.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MemberLoginDTO {

	@NotBlank(message = "아이디를 입력해주세요.")
	private String loginId;
	
	@NotBlank(message = "비밀번호를 입력해주세요.")
	private String mpwd;
	
	
}
