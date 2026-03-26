package com.example.gmall.service.impl;

import org.springframework.stereotype.Service;

import com.example.gmall.domain.Member;
import com.example.gmall.dto.UserSignupDTO;
import com.example.gmall.repository.MemberRepository;
import com.example.gmall.service.EmailService;
import com.example.gmall.service.MemberService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
	
	private final MemberRepository memberRepository;
	private final EmailService emailService;
	@Override
	public void checkLoginId(String logId) {
	if(	memberRepository.existsByLoginId(logId)) {
		throw new IllegalArgumentException("이미 사용중인 아이디입니다.");
	}
}
	
 public void signup(UserSignupDTO signupDTO) {
	 
	 boolean isVerified = emailService.verifyCode(signupDTO.getLoginId(), signupDTO.getVerificationCode());
	 
	if(!isVerified) {
	 throw new IllegalArgumentException("이메일 인증 번호가 일치하지 않거나 만료되었습니다.");
		 }
	 //아이디 중복검사
	 if(memberRepository.existsByLoginId(signupDTO.getLoginId())) {
		 throw new IllegalArgumentException("이미 사용 즁인 아아디입니다.");
	 }
	 
	 //전화번호 중복 검사
	 if(memberRepository.existsByTel(signupDTO.getTel())) {
		 throw new IllegalArgumentException("이미 사용 중인 전화번호입니다.");
	 }
	 
//	 Member member = new Member();
//	 member.setLoginId(signupDTO.getLoginId());
//	 member.setMpwd(signupDTO.getMpwd());
//	 member.setMname(signupDTO.getMname());
//	 member.setTel(signupDTO.getTel());
//	 member.setEmail(signupDTO.getLoginId());
//	 member.setGender(signupDTO.getGender());
//	 member.setEmailVerified(true); //프론트애서 인증 완료 후 요청
//	 member.setRole((byte) 0);
//	 member.setDeleted(false);
//	 
//	 memberRepository.save(member);
 }
	

}
