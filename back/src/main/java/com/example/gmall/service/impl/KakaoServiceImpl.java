package com.example.gmall.service.impl;


import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.example.gmall.domain.Member;
import com.example.gmall.dto.member.KakaoDTO;
import com.example.gmall.dto.member.MemberAuthDTO;
import com.example.gmall.repository.MemberRepository;
import com.example.gmall.service.KakaoService;
import com.example.gmall.util.JWTUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class KakaoServiceImpl implements KakaoService{
	
	private final MemberRepository memberRepository;
	private final JWTUtil jwtUtil;
	
	@Value("${kakao.client_id}")
    private String clientId;

    @Value("${kakao.redirect_uri}")
    private String redirectUri;
    
    @Value("${kakao.client_secret}") 
    private String clientSecret;
	
	@Override
	public MemberAuthDTO processKakaoLogin(String code) {
		
		//인가 코드로 카카오 Access Token 받기
		String accessToken = getAccessToken(code);
		
		//Access Token으로 카카오 유저정보 받기
		KakaoDTO kakaoDTO = getKakaoUserInfo(accessToken);
		
		String email = kakaoDTO.getKakao_account().getEmail();
		String loginId = "K_" + kakaoDTO.getId();
		
		Member member = memberRepository.findByLoginId(email).orElse(null);
		
		if(member == null) {
			//아이디 중복검사
			if(memberRepository.existsByLoginId(loginId)) {
				throw new IllegalArgumentException("이미 사용 중인 소셜 계정입니다.");
			}
			
			member = Member.builder()
					.loginId(loginId)
					.mname("카카오회원")
					.tel("010-0000-0000")// 전화번호 임시저장
					.email(loginId)
					.emailVerified(true)
					.role((byte) 0)
					.isDeleted(false)
					.build();
			
			memberRepository.save(member);
		}
		// 추가 정보 입력 필요 여부 판단(이름/번호가 임시값이면 true)
		boolean needsExtraInfo = member.getMname().equals("카카오회원") || member.getTel().equals("010-0000-0000");
		Map<String, Object> claims = member.getClaims();
		
		String ourAccessToken = jwtUtil.generateToken(claims, 60);
		String ourRefreshToken = jwtUtil.generateToken(claims, 60 * 24 * 7);
		
		
		return MemberAuthDTO.builder()
				.memberId((Long) claims.get("memberId"))
				.loginId((String) claims.get("loginId"))
				.mname((String)claims.get("mname"))
				.role((Byte)claims.get("role"))
				.accessToken(ourAccessToken)
				.refreshToken(ourRefreshToken)
				.needsExtraInfo(needsExtraInfo)
				.build();
	
	}
	
	private String getAccessToken(String code) {
		String reqURL = "https://kauth.kakao.com/oauth/token";
		RestTemplate rt = new RestTemplate();
		log.info("ClientId: " + clientId);
		//헤더 설정
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
		
		//바디 설정
		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", "authorization_code");
		params.add("client_id", clientId);
		params.add("redirect_uei", redirectUri);
		params.add("code",code);
		params.add("client_secret", clientSecret);
		
		HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(params,headers);
		
		try {
			ResponseEntity<Map> response = rt.exchange(reqURL, HttpMethod.POST, kakaoTokenRequest, Map.class);
			return (String) response.getBody().get("access_token");
		} catch (Exception e) {
			log.error("카카오 토큰 발급 에러 상세: " + e.getMessage());
		    throw new IllegalArgumentException("카카오로부터 토큰을 받아오지 못했습니다.");
		}
		
	}
	
	private KakaoDTO getKakaoUserInfo(String accessToken) {
		String reqURL = "https://kapi.kakao.com/v2/user/me";
		RestTemplate rt = new RestTemplate();
		
		// 헤더 설정
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization","Bearer "+accessToken);
		headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
		
		HttpEntity<MultiValueMap<String, String>> kakaoProfileRequest = new HttpEntity<>(headers);
		
		try {
			ResponseEntity<KakaoDTO> response = rt.exchange(reqURL, HttpMethod.POST, kakaoProfileRequest, KakaoDTO.class);
			return response.getBody();
		} catch (Exception e) {
			throw new IllegalArgumentException("카카오로부터 유저 정보를 가져오지 못했습니다.");
		}
	}
	
	

}
