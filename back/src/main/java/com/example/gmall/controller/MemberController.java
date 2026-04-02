package com.example.gmall.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.gmall.dto.member.MemberDTO;
import com.example.gmall.dto.member.MemberLoginDTO;
import com.example.gmall.dto.member.SellerSignupDTO;
import com.example.gmall.dto.member.UserSignupDTO;
import com.example.gmall.service.EmailService;
import com.example.gmall.service.MemberService;

import jakarta.servlet.http.HttpServletResponse;
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
	public ResponseEntity<?> login(@RequestBody @Valid MemberLoginDTO loginDTO, HttpServletResponse response){
		
		try {
			Map<String, Object> loginResponse = memberService.login(loginDTO, response);
			return ResponseEntity.ok(loginResponse);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
		}
	}
	
	@GetMapping("/me")
	public ResponseEntity<MemberDTO> getMemberInfo(Authentication authentication){
		if (authentication == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	    }
		
		Long memberId = (Long) authentication.getPrincipal();
		log.info("인증된 회원 PK: {}",memberId);
	    
		MemberDTO dto = memberService.getMemberId(memberId);
		return ResponseEntity.ok(dto);
	}
	
	@PutMapping("/modify")
	public ResponseEntity<?> modifyMember(@RequestBody MemberDTO memberDTO){
		log.info("회원 수정 요청 {}", memberDTO);
		try {
			memberService.modifyMember(memberDTO);
			
			return ResponseEntity.ok(Map.of("result","success"));
			
		} catch (Exception e) {
			log.error("수정 실패: ",e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(Map.of("message",e.getMessage()));
		}
	}
		
		@PostMapping("/find-id")
		public ResponseEntity<?> findId(@RequestBody Map<String, String> request){
		try {
			String mname = request.get("mname");
			String tel = request.get("tel");
			
			String foundId = memberService.findLoginId(mname, tel);
			
			return ResponseEntity.ok(Map.of("loginId",foundId));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(Map.of("message",e.getMessage()));
		}
		
	}
		@PostMapping("/reset-password")
		public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request){
			try {
				String loginId = request.get("loginId");
				String nmpwd = request.get("nmpwd");
				
				memberService.resetPassword(loginId, nmpwd);
				return ResponseEntity.ok(Map.of("result","success"));
				
			} catch (Exception e) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body(Map.of("message",e.getMessage()));
			}
		}
		
		@PostMapping("/withdraw")
		public ResponseEntity<?> withdraw(@RequestBody Map<String, String> request) {
			
				String memberId = request.get("id");
				String mpwd = request.get("mpwd");
				
				log.info("회원 탈퇴 요청 - ID:{}", memberId);
				try {
					memberService.withdraw(memberId, mpwd);
					
					return ResponseEntity.ok(Map.of(
							"result","success",
							"message","탈퇴 처리가 완료되었습니다"
							));
				
			} catch (IllegalArgumentException e) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body(Map.of("message",e.getMessage()));
			}catch (Exception e) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.body(Map.of("message","서버에 오류가 발생했습니다."));
			}
		}
		@PostMapping("/register-seller")
		public ResponseEntity<?> registerSeller(@Valid @RequestBody SellerSignupDTO dto) {
		    log.info("판매자 가입 신청 시작: " + dto.getLoginId());
		    
		    memberService.registerSeller(dto);
		    
		    return ResponseEntity.ok(Map.of(
		        "message", "판매자 가입 신청이 완료되었습니다. 관리자 승인을 기다려주세요."
		    ));
		}
		
		
}
