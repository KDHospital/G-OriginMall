package com.example.gmall.service.Impl;

import org.springframework.stereotype.Service;

import com.example.gmall.domain.Member;
import com.example.gmall.dto.UserSignupDto;
import com.example.gmall.repository.MemberRepository;
import com.example.gmall.service.MemberService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {
	
	private final MemberRepository memberRepository;
	
	@Override
	public void checkLoginId(String logId) {
	if(	memberRepository.existsByLoginId(logId)) {
		throw new IllegalArgumentException("이미 사용중인 아이디입니다.");
	}
}
	
 public void signup(UserSignupDto signupDto) {
	 
	 //아이디 중복검사
	 if(memberRepository.existsByLoginId(signupDto.getLoginId())) {
		 throw new IllegalArgumentException("이미 사용 즁인 아아디입니다.");
	 }
	 
	 //전화번호 중복 검사
	 if(memberRepository.existsByTel(signupDto.getTel())) {
		 throw new IllegalArgumentException("이미 사용 중인 전화번호입니다.");
	 }
	 
	 Member member = new Member();
	 member.setLoginId(signupDto.getLoginId());
	 member.setMpwd(signupDto.getMpwd());
	 member.setMname(signupDto.getMname());
	 member.setTel(signupDto.getTel());
	 member.setEmail(signupDto.getLoginId());
	 member.setGender(signupDto.getGender());
	 member.setEmailVerified(true); //프론트애서 인증 완료 후 요청
	 member.setRole((byte) 0);
	 member.setDeleted(false);
	 
	 memberRepository.save(member);
 }
	

}
