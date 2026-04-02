package com.example.gmall.service;

import java.util.Map;

import com.example.gmall.dto.member.MemberDTO;
import com.example.gmall.dto.member.MemberLoginDTO;
import com.example.gmall.dto.member.SellerSignupDTO;
import com.example.gmall.dto.member.UserSignupDTO;

import jakarta.servlet.http.HttpServletResponse;

public interface MemberService {
	
	// 아이디 중복확인
	void checkLoginId(String loginId);
	
	
	//일반 회원가입
	void signup(UserSignupDTO signupDto);
	
	//로그인
	Map<String, Object> login(MemberLoginDTO loginDTO,HttpServletResponse response);
	
	MemberDTO getMemberLoginId(String loginId);
	
	MemberDTO getMemberId(Long MemberId);
	
	void modifyMember(MemberDTO memberDTO);

	public String findLoginId(String mname, String tel);
	
	void resetPassword(String loginId, String nmpwd);
	
	void withdraw(String memberId, String mpwd);
	
	void registerSeller(SellerSignupDTO dto);
	
	void approveSeller(Long memberId);
	
	void rejectSeller(Long memberId);
}
