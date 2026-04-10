package com.example.gmall.dto.member;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@JsonIgnoreProperties(ignoreUnknown = true) //선언되지 않은 필드가 있어도 무시
public class KakaoDTO {

	private Long id;
	private KakaoAccount kakao_account;
	
	
	@Getter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor(access = AccessLevel.PROTECTED)
	@JsonIgnoreProperties(ignoreUnknown = true) //선언되지 않은 필드가 있어도 무시
	public static class KakaoAccount{
		private String email;
        // 이름, 전화번호, 성별은 권한이 없으면 null로 들어옴
        private String name;
        private String phone_number;
        private String gender;
	}
	
}
