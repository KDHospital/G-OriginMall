package com.example.gmall.service;

import com.example.gmall.dto.MemberLoginDTO;
import com.example.gmall.dto.UserSignupDTO;

public interface MemberService {
	
	// 아이디 중복확인
	void checkLoginId(String loginId);
	
	
	//일반 회원가입
	void signup(UserSignupDTO signupDto);
	
	//로그인
	String login(MemberLoginDTO loginDTO);

}
