package com.example.gmall.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.gmall.domain.Member;
import com.example.gmall.dto.member.MemberDTO;
import com.example.gmall.dto.member.MemberLoginDTO;
import com.example.gmall.dto.member.SellerSignupDTO;
import com.example.gmall.dto.member.UserSignupDTO;
import com.example.gmall.repository.MemberRepository;
import com.example.gmall.service.BusinessVerificationService;
import com.example.gmall.service.EmailService;
import com.example.gmall.service.MemberService;
import com.example.gmall.util.JWTUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class MemberServiceImpl implements MemberService {
	
	private final MemberRepository memberRepository;
	private final EmailService emailService;
	private final JWTUtil jwtUtil;
	private final PasswordEncoder passwordEncoder;
	private final BusinessVerificationService businessService;
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
		 throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
	 }
	 
	 //전화번호 중복 검사
	 if(memberRepository.existsByTel(signupDTO.getTel())) {
		 throw new IllegalArgumentException("이미 사용 중인 전화번호입니다.");
	 }
	 
   Member member = Member.builder()
		   .loginId(signupDTO.getLoginId())
		   .mpwd(passwordEncoder.encode(signupDTO.getMpwd()))
		   .mname(signupDTO.getMname())
		   .tel(signupDTO.getTel())
		   .email(signupDTO.getLoginId())
		   .gender(signupDTO.getGender())
		   .emailVerified(true)
		   .role((byte)0)
		   .isDeleted(false)
		   .build();
   
   memberRepository.save(member);
		   
 }
 	
 	@Override
 	public String login(MemberLoginDTO loginDTO) {
 		
 		//아이디로 회원 조회
 		Member member = memberRepository.findByLoginId(loginDTO.getLoginId())
 				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디입니다."));
 	
 		//탈퇴 여부 확인
 		if(member.isDeleted()) {
 			throw new IllegalArgumentException("탈퇴 처리된 계정입니다. 고객센터에 문의하세요");
 		}
 	// 비비밀번호 일치 확인
 	 	if(!passwordEncoder.matches(loginDTO.getMpwd(), member.getMpwd())) {
 	 		throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
 	 	}
 	 	
 	 	java.util.Map<String, Object> claims = java.util.Map.of(
 	 			"loginId",member.getLoginId(),
 	 			"memberId",member.getId(),
 	 			"role",member.getRole()
 	 			);
 	// 인증 성공 시 JWT 토큰 생성 및 반환
 	  return jwtUtil.generateToken(claims, 60);
 	
 	}
 	@Override
 	public MemberDTO getMemberLoginId(String loginId) {
 		Member member = memberRepository.findByLoginId(loginId)
 				.orElseThrow( () -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
 		
 		return MemberDTO.builder()
 				.id(member.getId())
 				.loginId(member.getLoginId())
 				.mname(member.getMname())
 				.tel(member.getTel())
 				.gender(member.getGender())
 				.role(member.getRole())
 				.build();
 	}
 	
 	@Override
 	public MemberDTO getMemberId(Long memberId) {
 		Member member = memberRepository.findById(memberId)
 				.orElseThrow( () -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
 		
 		return MemberDTO.builder()
 				.id(member.getId())
 				.loginId(member.getLoginId())
 				.mname(member.getMname())
 				.tel(member.getTel())
 				.gender(member.getGender())
 				.build();
 	}
 	
 	@Override
 	public void modifyMember(MemberDTO memberDTO) {
 		Member member = memberRepository.findById(memberDTO.getId())
 				.orElseThrow(()-> new RuntimeException("해당 회원을 찾을 수 없습니다."));
 		
 		if(!passwordEncoder.matches(memberDTO.getCurrentMpwd(),member.getMpwd() )) {
 			throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
 		
 		}
 		member.changeName(memberDTO.getMname());
 		member.changeTel(memberDTO.getTel());
 		member.changeGender(memberDTO.getGender());
 		
 		if(memberDTO.getMpwd() != null && !memberDTO.getMpwd().trim().isEmpty()) {
 			
 			if(passwordEncoder.matches(memberDTO.getMpwd(), member.getMpwd())) {
 				throw new RuntimeException("새 비밀번호는 기존 비밀번호와 다르게 설정해야 합니다.");
 			}
 			
 			String encodedPassword = passwordEncoder.encode(memberDTO.getMpwd());
 			member.changePassword(encodedPassword);
 			
 		}
 		memberRepository.save(member);
 	}
 	
 	@Override
 	public String findLoginId(String mname, String tel) {
 		Member member = memberRepository.findByMnameAndTel(mname, tel)
 				.orElseThrow(() -> new IllegalArgumentException("일치하는 회원 정보가 없습니다."));
 		
 		String loginId = member.getLoginId();
 		
 		if(loginId.contains("@")) {
 			String[] parts = loginId.split("@");
 			String idPart = parts[0];
 			String domainPart = parts[1];
 			
 			if(idPart.length() > 3) {
 				String maskedId= idPart.substring(0,3) + "*".repeat(idPart.length());
 				return maskedId + "@" + domainPart;
 			}else {
 				return idPart.substring(0,1) + "**@" + domainPart;
 			}
 		}
 		return loginId.substring(0,3) + "***";
 	}
 	
 	@Override
 	public void resetPassword(String loginId, String nmpwd) {
 		
 		Member member = memberRepository.findByLoginId(loginId)
 				.orElseThrow(() -> new RuntimeException("해당 이메일로 가입된 회원이 없습니다."));
 	
 	String encodedePassword = passwordEncoder.encode(nmpwd);
 	member.changePassword(encodedePassword);
 	
 	memberRepository.save(member);
 	
 	
 	}
 	@Override
 	public void withdraw(String memberId, String mpwd) {
 		Long id = Long.parseLong(memberId);
 		
 		Member  member = memberRepository.findById(id)
 				.orElseThrow(()-> new IllegalArgumentException("존재하지 않는 사용자입니다."));
 	
 		if(!passwordEncoder.matches(mpwd, member.getMpwd())) {
 			throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");	
 		}
 		
 		member.changeDeleteStatus(true);
 		
 		log.info("회원 탈퇴 완료: ID {}", id);
 	
 	}
public void registerSeller(SellerSignupDTO dto) {
        
       
        if (!businessService.isRealBusiness(dto.getBusinessNo())) {
            throw new IllegalArgumentException("유효하지 않거나 폐업된 사업자 번호입니다.");
        }

       
        if (memberRepository.findByLoginId(dto.getLoginId()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }

        
        Member seller = Member.builder()
                .loginId(dto.getLoginId())
                .mpwd(passwordEncoder.encode(dto.getMpwd()))
                .mname(dto.getMname())
                .tel(dto.getTel())
                .email(dto.getLoginId())
                .gender(dto.getGender())
                .role((byte) 1)             
                .businessNo(dto.getBusinessNo())
                .taxInvoice(dto.getTaxInvoice())
                .isVerified(dto.getIsVerified())
                .settlementName(dto.getSettlementName())
                .settlementBank(dto.getSettlementBank())
                .bankAccount(dto.getBankAccount())
                .businessVerified(false)    
                .build();

        memberRepository.save(seller);
    }


 	@Override
 	public void approveSeller(Long memberId) {
 		Member member = memberRepository.findById(memberId)
 				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
 		
 		if (member.getRole() != 1) {
 			throw new IllegalStateException("판매자 권한을 가진 회원만 승인할 수 있습니다.");
 		}
 		
 		member.updateBusinessVerify(true);
 		log.info("판매자 승인 완료: {}", member.getLoginId());
 	}
 	
 	@Override
 	public void rejectSeller(long memberId) {
 		Member member = memberRepository.findById(memberId)
 				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
 		
 		if(member.getRole() != 1) {
 			throw new IllegalStateException("판매자 계정만 거절 처리할 수 있습니다.");
 		}
 			member.rejectBusinessVerify();
 			
 			log.info("판매자 입점 거절 완료: {}",member.getLoginId());
 		
 	}
 	
 	

}
