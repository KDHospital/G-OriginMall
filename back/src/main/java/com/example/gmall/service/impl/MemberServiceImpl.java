package com.example.gmall.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.gmall.domain.Member;
import com.example.gmall.dto.member.MemberDTO;
import com.example.gmall.dto.member.MemberLoginDTO;
import com.example.gmall.dto.member.SellerDTO;
import com.example.gmall.dto.member.SellerSignupDTO;
import com.example.gmall.dto.member.UserSignupDTO;
import com.example.gmall.repository.MemberRepository;
import com.example.gmall.repository.SnsRepository;
import com.example.gmall.service.BusinessVerificationService;
import com.example.gmall.service.EmailService;
import com.example.gmall.service.MemberService;
import com.example.gmall.util.JWTUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
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
	private final SnsRepository snsRepository;
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
 	//회원 로그인
 	@Override
 	public Map<String, Object> login(MemberLoginDTO loginDTO, HttpServletResponse response) {
 		
 		//아이디로 회원 조회
 		Member member = memberRepository.findByLoginId(loginDTO.getLoginId())
 				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디입니다."));
 	
 		//탈퇴 여부 확인
 		if(member.isDeleted()) {
 			throw new IllegalArgumentException("탈퇴 처리된 계정입니다. 고객센터에 문의하세요");
 		}
 		
 		//표식 제거후 비밀번호 비교
 		String dbPassword = member.getMpwd();
 		
 		
 	   // 비비밀번호 일치 확인
 		if (dbPassword != null && dbPassword.endsWith("_MOD")) {
 	        dbPassword = dbPassword.substring(0, dbPassword.length() - 4); 
 	    }

 	    
 	    if(!passwordEncoder.matches(loginDTO.getMpwd(), dbPassword)) {
 	        throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
 	    }
 	 	//관리자 승인전 로그인 안되게하는 메소드
 	 	if (member.getRole() == 1 && !member.isBusinessVerified()) {
 	 	    throw new IllegalArgumentException("관리자 승인 대기 중인 판매자 계정입니다. 승인 완료 후 로그인 가능합니다.");
 	 	}
 	 	//사용자 정보조회
 	 	Map<String, Object> claims = member.getClaims();
 	 	
 	 	// JWT 토큰 생성 (Access: 60분, Refresh: 7일)
 	 	String accessToken = jwtUtil.generateToken(claims, 60);
 	 	String refreshToken = jwtUtil.generateToken(claims, 60*24*7);
 	    //  Refresh Token을 보안 쿠키(HttpOnly)에 저장
 	 	Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
 	 	refreshCookie.setHttpOnly(true);
 	 	refreshCookie.setPath("/");
 	 	refreshCookie.setMaxAge(60*60*24*7);
 	 	refreshCookie.setSecure(true);
 	 	response.addCookie(refreshCookie);
 	    // 응답 데이터 구성 및 반환
 	 	claims.put("accessToken" , accessToken);
 	 	claims.put("result", "success");
 	 	
 	 	return claims;
 	}
 	
 	//로그인ID로 회원조회
 	@Override
 	public MemberDTO getMemberLoginId(String loginId) {
 		Member member = memberRepository.findByLoginId(loginId)
 				.orElseThrow( () -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
 		
 		boolean isSocial = snsRepository.existsByMember(member);
 		String password = member.getMpwd();
 	    boolean needsInfo = isSocial && (password == null || !password.endsWith("_MOD"));
 		return MemberDTO.builder()
 				.id(member.getId())
 				.loginId(member.getLoginId())
 				.mname(member.getMname())
 				.tel(member.getTel())
 				.gender(member.getGender())
 				.role(member.getRole())
 				.social(isSocial)
 				.needsExtraInfo(needsInfo)
 				.build();
 	}
 	
 	//ID로 회원조회
 	@Override
 	public MemberDTO getMemberId(Long memberId) {
 		Member member = memberRepository.findById(memberId)
 				.orElseThrow( () -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
 		
 		boolean isSocial = snsRepository.existsByMember(member);
 		String password = member.getMpwd();
 		boolean needsInfo = isSocial && (password == null || !password.endsWith("_MOD"));
 	    
 		return MemberDTO.builder()
 				.id(member.getId())
 				.loginId(member.getLoginId())
 				.mname(member.getMname())
 				.tel(member.getTel())
 				.gender(member.getGender())
 				.social(isSocial)
 				.needsExtraInfo(needsInfo)
 				.build();
 	}
 	//회원정보 수정
 	@Override
 	public void modifyMember(MemberDTO memberDTO) {
 		//회원 존재여부 확인
 		Member member = memberRepository.findById(memberDTO.getId())
 	            .orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
 	    
 	    boolean isSocial = snsRepository.existsByMember(member);
 	    
 	    //  현재 비밀번호 검증 (일반 유저만 필수)
 	    if (!isSocial) {
 	        // DB의 비밀번호에서 표식을 떼고 검증 (혹시 모를 상황 대비)
 	        String rawDbPwd = member.getMpwd();
 	        if (rawDbPwd != null && rawDbPwd.endsWith("_MOD")) {
 	            rawDbPwd = rawDbPwd.substring(0, rawDbPwd.length() - 4);
 	        }
 	        
 	        if (!passwordEncoder.matches(memberDTO.getCurrentMpwd(), rawDbPwd)) {
 	            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
 	        }
 	    }

 	    //  기본 정보 변경 (이름, 전화번호, 성별)
 	    member.changeName(memberDTO.getMname());
 	    member.changeTel(memberDTO.getTel());
 	    member.changeGender(memberDTO.getGender());

 	    // 4. 비밀번호 변경 및 표식 처리
 	    String newPwd = memberDTO.getMpwd();
 	    
 	    if (newPwd != null && !newPwd.trim().isEmpty()) {
 	        // [케이스 A] 새 비밀번호를 입력한 경우 (일반/소셜 공통)
 	        // 새 비밀번호 암호화 + 무조건 뒤에 _MOD를 붙여서 "수정 완료" 상태로 만듦
 	        String encoded = passwordEncoder.encode(newPwd);
 	        member.changePassword(encoded + "_MOD");
 	    } 
 	    else if (isSocial) {
 	        // [케이스 B] 소셜 유저가 비밀번호는 안 건드리고 이름만 고친 경우
 	        String currentPwd = member.getMpwd();
 	        if (currentPwd == null) {
 	            member.changePassword("SOCIAL_MOD"); // 완전 최초 수정 시
 	        } else if (!currentPwd.endsWith("_MOD")) {
 	            member.changePassword(currentPwd + "_MOD"); // 기존 UUID나 암호 뒤에 표식 추가
 	        }
 	    }
 	    
 	    // 5. 최종 저장
 	    memberRepository.save(member);
 	}
 	//아이디 찾기
 	@Override
 	public String findLoginId(String mname, String tel) {
 		//아이디와 전화번로가 일치하는 회원찾기
 		Member member = memberRepository.findByMnameAndTel(mname, tel)
 				.orElseThrow(() -> new IllegalArgumentException("일치하는 회원 정보가 없습니다."));
 		
 		String loginId = member.getLoginId();
 		
 		//이메일 형식인 경우 마스킹 처리
 		if(loginId.contains("@")) {
 			String[] parts = loginId.split("@");
 			String idPart = parts[0];
 			String domainPart = parts[1];
 		// 아이디 길이에 따른 마스킹 전략 분기
 			if(idPart.length() > 3) {
 			// 3글자 이후부터 모두 마스킹
 				String maskedId= idPart.substring(0,3) + "*".repeat(idPart.length());
 				return maskedId + "@" + domainPart;
 			}else {
 			// 아이디가 너무 짧은 경우(3자 이하) 앞 1글자만 공개
 				return idPart.substring(0,1) + "**@" + domainPart;
 			}
 			
 		}
 		if (loginId.length() > 3) {
 	        return loginId.substring(0, 3) + "*".repeat(loginId.length() - 3);
 	    }
 		return loginId.substring(0,3) + "***";
 	}
 	//비밀번호 재설정
 	@Override
 	public void resetPassword(String loginId, String nmpwd) {
    
 		Member member = memberRepository.findByLoginId(loginId)
 				.orElseThrow(() -> new RuntimeException("해당 이메일로 가입된 회원이 없습니다."));
 	
 	String encodedePassword = passwordEncoder.encode(nmpwd);
   
 	member.changePassword(encodedePassword);
    
 	memberRepository.save(member);
 	
 	
 	}
 	//회원탈퇴
 	@Override
 	public void withdraw(String memberId, String mpwd) {
 		
 		Long id = Long.parseLong(memberId);
 		
 		//  회원 존재 여부 확인
 		Member  member = memberRepository.findById(id)
 				.orElseThrow(()-> new IllegalArgumentException("존재하지 않는 사용자입니다."));
 		//비밀번호 검증
 		if(!passwordEncoder.matches(mpwd, member.getMpwd())) {
 			throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");	
 		}
 		//탈퇴 상태 변경 (Soft Delete)
 		member.changeDeleteStatus(true);
 		
 		log.info("회원 탈퇴 완료: ID {}", id);
 	
 	}
 	//판매자 회원가입
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
                .emailVerified(true)
                .businessNo(dto.getBusinessNo())
                .taxInvoice(dto.getTaxInvoice())
                .cashReceiptNo(dto.getCashReceiptNo())
                .isVerified(dto.getIsVerified())
                .settlementName(dto.getSettlementName())
                .settlementBank(dto.getSettlementBank())
                .bankAccount(dto.getBankAccount())
                .businessVerified(false)   
                .description(dto.getDescription())
                .build();

        memberRepository.save(seller);
    }
 	
 	@Override
 	public void approveSeller(Long memberId) {
 		Member member = memberRepository.findById(memberId)
 				.orElseThrow(()-> new IllegalArgumentException("존재하지 않는 회원입니다."));
 		
 		member.updateBusinessVerify(true);
 		
 		emailService.sendSellerStatusNotice(member.getEmail(), member.getMname(), true);
 	}
 	
 	@Override
 	public void rejectSeller(Long memberId) {
 		Member member = memberRepository.findById(memberId)
 	            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
 		
 		String email = member.getEmail();
 	    String name = member.getMname();
 	    
 	    memberRepository.delete(member);
 	    
 	    emailService.sendSellerStatusNotice(email, name, false);
 	}
 	
 	@Override
 	public List<SellerDTO> getPendingSellerList() {
 		
 		return memberRepository.findAllByRoleAndBusinessVerified((byte) 1, false)
 				.stream()
 				.map(seller -> SellerDTO.builder()
 						.id(seller.getId())
 						.loginId(seller.getLoginId())
 						.mname(seller.getMname())
 						.businessNo(seller.getBusinessNo())
 						.tel(seller.getTel())
 						.createdAt(seller.getCreatedAt())
 						.build())
 				.toList();
 	
 	
 	}

}
