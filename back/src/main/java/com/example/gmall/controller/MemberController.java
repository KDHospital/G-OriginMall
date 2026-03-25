package com.example.gmall.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.gmall.dto.MemberLoginDTO;
import com.example.gmall.dto.UserSignupDTO;
import com.example.gmall.service.EmailService;
import com.example.gmall.service.MemberService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {

	private final MemberService memberService;
	private final EmailService emailService;
	
	//아이디 중복확인
	@GetMapping("/check-id")
	public ResponseEntity<String> checkId(@RequestParam("loginId") String loginId){
		memberService.checkLoginId(loginId);
		return ResponseEntity.ok("사용 가능한 아이디입니다.");
	}
	
	// 이메일 인증코드 발송
	@PostMapping("/email/send")
	public ResponseEntity<String> sendEmailCode(@RequestBody Map<String, String> request){
		String email = request.get("email");
		emailService.sendCode(email);
		return ResponseEntity.ok("인증 코드가 발송되었습니다.");
	}
	
	//이메일 인증코드 확인
	@PostMapping("/email/verify")
	public ResponseEntity<String> verifyEmailCode(@RequestBody Map<String, String> request){
		String email = request.get("email");
		String code = request.get("code");
		emailService.verifyCode(email, code);
		return ResponseEntity.ok("이메일 인증이 완료되었습니다.");
	}
	
	
	//일반 회원가입
	@PostMapping("/signup")
	public ResponseEntity<String> signup(@RequestBody @Valid UserSignupDTO signupDTO){
		log.info("회원가입 요청 이메일: {}", signupDTO.getLoginId());
		memberService.signup(signupDTO);
		return ResponseEntity.ok("회원가입이 완료되었습니다.");
	}
	
	//로그인
	@PostMapping("/login")
	public ResponseEntity<Map<String, String>> login(@RequestBody @Valid MemberLoginDTO loginDTO){
		String accessToken = memberService.login(loginDTO);
		
		return ResponseEntity.ok(Map.of("accessToken",accessToken));
	}
	
}
