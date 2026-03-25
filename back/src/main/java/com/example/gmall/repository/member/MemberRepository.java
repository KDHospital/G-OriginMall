package com.example.gmall.repository.member;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.gmall.domain.Member;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
	
	//로그인 ID로 회원 찾기
	Optional<Member> findByLoginId(String loginID);
	
	//이메일로 회원 찾기(아이디 찾기 또는 중복 가입 방지) 
	Optional<Member> findByEmail(String email);
	
	//특정 역할을 가진 회원 목록 조회(0=USER, 1=SELLER, 2=ADMIN)
	List<Member> findByRole(Byte role);
	
	//삭제되지 않은 회원 중 로그인 ID존재 여부 확인(중복 체크)
	boolean existsByLoginIdAndIsDeletedFalse(String loginId);
	
	//판매자 중 인증된 판매자만 조회
	List<Member> findByRoleAndIsVerifiedTrue(Byte role);

	
		
}
