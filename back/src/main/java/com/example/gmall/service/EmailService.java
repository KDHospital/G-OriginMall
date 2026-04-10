package com.example.gmall.service;

public interface EmailService {

	
	// 이메일 인증코드 발송
	// POST /api/member/email/send
	//@param email 인증코드를 받을 이메일 주소
	void sendCode(String email, String tyep);
	
	//이메일 인증코드 확인
	//POST /api/member/email/verify
	// @param email 인증 요청 이메일
	// @param code 사용자가 입력한 6자리 코드
	boolean verifyCode(String email, String code);
	
	void sendSellerStatusNotice(String email, String mname, boolean isApprovde);
}
