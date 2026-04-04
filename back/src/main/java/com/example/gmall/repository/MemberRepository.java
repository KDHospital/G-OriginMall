package com.example.gmall.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gmall.domain.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

	
	//===[중복 확인 센션] 가입 시 실시간 유효성 검사용===
     // * 아이디(이메일) 중복 확인
    //  * 사용: 일반/판매자 회원가입 시 loginId 중복 검사
    // * API : POST /api/member/check-id
     
    boolean existsByLoginId(String loginId);
 
    
    // * 이메일 중복 확인
    // * 사용: 이메일 인증 발송 전 기존 가입 여부 확인
     
    boolean existsByEmail(String email);
 
    
    //  * 전화번호 중복 확인
    // * 사용: 회원가입 시 tel 중복 검사
     
    boolean existsByTel(String tel);
 
    
    
  //===[조회 센션] 인증 및 정보 수정용===
    // * loginId(이메일)로 회원 조회
    // * 사용: 로그인, 이메일 인증 완료 처리
     
    Optional<Member> findByLoginId(String loginId);
 
    
    // * 이메일로 회원 조회
    // * 사용: 소셜 로그인, 비밀번호 찾기
     
    Optional<Member> findByEmail(String email);
 
    
    
    //===[보안 센션] 로그인 및 권한 체크용===
     // 활성 회원만 조회 (탈퇴 제외)
     // 사용: 로그인 시 탈퇴 회원 접근 차단
    
    Optional<Member> findByLoginIdAndIsDeletedFalse(String loginId);
    
    
    // * Member의 id로 회원 조회
    // * 사용: JWT 관련 처리
    Optional<Member> findById(Long memberId);
    
    //회원 아이디찾기
    Optional<Member> findByMnameAndTel(String mname, String tel);
    
    //탈퇴 여부가 true이고 탈퇴 날짜가 특정 시점(1년 전)보다 이전인 회원 찾기
    List<Member> findByIsDeletedTrueAndWithdrawAtBefore(LocalDateTime threshold);
    
    //
    List<Member> findAllByRoleAndBusinessVerified(Byte role, boolean businessVerified);
 
   
}
