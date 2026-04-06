package com.example.gmall.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
    
    
    //고객문의에서 사용
    Optional<Member> findByIdAndIsDeletedFalse(Long id);

    // ===== 관리자 회원 목록 조회 =====
    Page<Member> findByRole(Byte role, Pageable pageable);

    @Query("SELECT m FROM Member m WHERE m.role = :role AND m.isDeleted = false")
    Page<Member> findByRoleAndIsDeletedFalse(@Param("role") Byte role, Pageable pageable);

    @Query("SELECT m FROM Member m WHERE m.role = :role AND m.isDeleted = true")
    Page<Member> findByRoleAndIsDeletedTrue(@Param("role") Byte role, Pageable pageable);

    @Query("SELECT m FROM Member m WHERE m.role = :role AND (m.mname LIKE %:keyword% OR m.loginId LIKE %:keyword% OR m.email LIKE %:keyword%)")
    Page<Member> findByRoleAndKeyword(@Param("role") Byte role, @Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT m FROM Member m WHERE m.role = :role AND m.isDeleted = :isDeleted AND (m.mname LIKE %:keyword% OR m.loginId LIKE %:keyword% OR m.email LIKE %:keyword%)")
    Page<Member> findByRoleAndIsDeletedAndKeyword(@Param("role") Byte role, @Param("isDeleted") boolean isDeleted, @Param("keyword") String keyword, Pageable pageable);
    //
    List<Member> findAllByRoleAndBusinessVerified(Byte role, boolean businessVerified);

    // 판매회원: 승인상태 필터 (페이징)
    @Query("SELECT m FROM Member m WHERE m.role = :role AND m.businessVerified = :verified")
    Page<Member> findByRoleAndBusinessVerified(@Param("role") Byte role, @Param("verified") boolean verified, Pageable pageable);

    @Query("SELECT m FROM Member m WHERE m.role = :role AND m.businessVerified = :verified AND (m.mname LIKE %:keyword% OR m.loginId LIKE %:keyword% OR m.businessNo LIKE %:keyword%)")
    Page<Member> findByRoleAndBusinessVerifiedAndKeyword(@Param("role") Byte role, @Param("verified") boolean verified, @Param("keyword") String keyword, Pageable pageable);

    // 판매회원: 동적 필터 (키워드 + 승인여부 + 회원상태)
    @Query("SELECT m FROM Member m WHERE m.role = :role" +
           " AND (:keyword IS NULL OR m.mname LIKE %:keyword% OR m.loginId LIKE %:keyword% OR m.businessNo LIKE %:keyword%)" +
           " AND (:verified IS NULL OR m.businessVerified = :verified)" +
           " AND (:isDeleted IS NULL OR m.isDeleted = :isDeleted)")
    Page<Member> findSellersByFilters(@Param("role") Byte role, @Param("keyword") String keyword, @Param("verified") Boolean verified, @Param("isDeleted") Boolean isDeleted, Pageable pageable);
}
