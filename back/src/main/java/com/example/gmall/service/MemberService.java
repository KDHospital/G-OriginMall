package com.example.gmall.service;

import com.example.gmall.dto.UserSignupDto;

public interface MemberService {
	
	// 아이디 중복확인
	void checkLoginId(String loginId);
	
	
	//일반 회원가입
	void signup(UserSignupDto signupDto);

}
