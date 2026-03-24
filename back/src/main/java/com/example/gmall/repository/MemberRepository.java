package com.example.gmall.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gmall.domain.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {


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
 
    
    
    
    // * loginId(이메일)로 회원 조회
    // * 사용: 로그인, 이메일 인증 완료 처리
     
    Optional<Member> findByLoginId(String loginId);
 
    
    // * 이메일로 회원 조회
    // * 사용: 소셜 로그인, 비밀번호 찾기
     
    Optional<Member> findByEmail(String email);
 
   
     // 활성 회원만 조회 (탈퇴 제외)
     // 사용: 로그인 시 탈퇴 회원 접근 차단
    
    Optional<Member> findByLoginIdAndIsDeletedFalse(String loginId);
 
   
}
