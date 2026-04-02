package com.example.gmall.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.gmall.service.MemberService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Log4j2
public class AdminController {

	private final MemberService memberService;
	
	//입점 승인
	@PostMapping("/approve-seller/{memberId}")
	public ResponseEntity<?> approve(@PathVariable("memberId") Long memberId){
		
		log.info("판매자 승인 요청 - ID: {}", memberId);
		
		memberService.approveSeller(memberId);
		return ResponseEntity.ok(Map.of("message","판매자 입점 승인 완료되었습니다."));
	}
	
	
	//입점 거절
	@PostMapping("/reject-seller/{memberId}")
	public ResponseEntity<?> reject(@PathVariable("memberId") Long memberId){
		
		log.info("판재마 거절 요청 -ID: {}",memberId);
		
		memberService.rejectSeller(memberId);
		return ResponseEntity.ok(Map.of("message","판매자 입점 신청이 거절되었습니다."));
	}
	
	@GetMapping("/seller-list")
	public ResponseEntity<?> getPendingSellers() {
		log.info("승인 대기 중인 판매자 목록 조회");
		
		return ResponseEntity.ok(memberService.getPendingSellerList());
	}
}
