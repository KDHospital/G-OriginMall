package com.example.gmall.service.impl;


import java.util.Map;
import java.util.Optional;

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
import com.example.gmall.domain.Sns;
import com.example.gmall.dto.member.MemberAuthDTO;
import com.example.gmall.repository.MemberRepository;
import com.example.gmall.repository.SnsRepository;
import com.example.gmall.service.NaverService;
import com.example.gmall.util.JWTUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class NaverServiceImpl implements NaverService{

    private final MemberRepository memberRepository;
    private final SnsRepository snsRepository;
    private final JWTUtil jwtUtil;

   @Value("${naver.client_id}")
   private String clientId;
   
   @Value("${naver.client_secret}")
   private String clientSecret;

    

	@Override
	public MemberAuthDTO processNaverLogin(String code, String state) {
	
	// 인가 코드로 네이버 Access Token 받기
	String accessToken = getAccessToken(code , state);
	
	// Access Token으로 네이버 유저정보 받기
	Map<String, Object> naverUserInfo = getNaverUserInfo(accessToken);
	//네이버는 'response' 키 안에 실제 유저 정보가 들어있다
	Map<String, Object> response = (Map<String, Object>) naverUserInfo.get("response");
	
	String providerUserId = (String) response.get("id");
	String email = (String) response.get("email");
	String	name = (String) response.get("name");
	
	Optional<Sns> snsResult = snsRepository.findByProviderAndProviderUserId("NAVER", providerUserId);
	
	Member member;
	if (snsResult.isPresent()) {
		member = snsResult.get().getMember();
	} else {
		member = memberRepository.findByLoginId(email).orElse(null);
		
		if(member == null) {
			member = Member.builder()
					.loginId(email)
					.mname(name != null ? name : "네이버회원")
					.tel("010-0000-0000")
					.email(email)
					.emailVerified(true)
					.role((byte) 0)
					.isDeleted(false)
					.build();
			memberRepository.save(member);
		}
		
		Sns sns = Sns.builder()
				.member(member)
				.provider("naver")
				.providerUserId(providerUserId)
				.build();
		snsRepository.save(sns);
	}
	
	if(member.getRole() == 1 && !member.isBusinessVerified()) {
		throw new IllegalArgumentException("관리자 승인 대기 중인 판매자 계정입니다.");
	}
	if(member.isDeleted()) {
		throw new IllegalArgumentException("탈퇴 처리된 계정입니다. 고객센터에 문의해주세요.");
	}
	
	boolean needsExtraInfo = member.getMname().equals("네이버회원") || member.getTel().equals("010-0000-0000");
	Map<String, Object> claims = member.getClaims();
	
	String ourAccessToken = jwtUtil.generateToken(claims, 60);
	String ourRefreshToken = jwtUtil.generateToken(claims, 60 * 24 * 7);
	
	return MemberAuthDTO.builder()
			.memberId((Long) claims.get("memberId"))
			.loginId((String) claims.get("loginId"))
			.mname((String) claims.get("mname"))
			.role((Byte) claims.get("role"))
			.accessToken(ourAccessToken)
			.refreshToken(ourRefreshToken)
			.needsExtraInfo(needsExtraInfo)
			.build();
	}
	
	private String getAccessToken(String code, String state) {
		String reqURL = "https://nid.naver.com/oauth2.0/token";
		RestTemplate rt = new RestTemplate();
		
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-type","application/x-www-form-urlencoded;charset=utf-8" );
		
		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type","authorization_code");
		params.add("client_id", clientId);
		params.add("client_secret", clientSecret);
		params.add("code", code);
		params.add("state", state);
		
		HttpEntity<MultiValueMap<String, String>> naverTokenRequest = new HttpEntity<>(params, headers);
		
		try {
			ResponseEntity<Map> response = rt.exchange(reqURL, HttpMethod.POST , naverTokenRequest, Map.class);
			return (String) response.getBody().get("access_token");
		} catch (Exception e) {
			log.error("네이버 토큰 발급 에러:"+ e.getMessage());
			throw new IllegalArgumentException("네이버로부터 토큰을 받아오지 못했습니다.");
		}
	}
	
	private Map<String, Object> getNaverUserInfo(String accessToken) {
		String reqURL = "https://openapi.naver.com/v1/nid/me";
		RestTemplate rt = new RestTemplate();
		
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Bearer "+ accessToken);
		
		HttpEntity<MultiValueMap<String, String>> naverProfileRequest = new HttpEntity<>(headers);
		
		try {
			ResponseEntity<Map> response = rt.exchange(reqURL, HttpMethod.GET, naverProfileRequest, Map.class);
			return response.getBody();
		} catch (Exception e) {
			throw new IllegalArgumentException("네이버로부터 유저 정보를 가져오지 못했습니다.");
		}
	}
	
	
	
	
	
	
	
	
	
}
