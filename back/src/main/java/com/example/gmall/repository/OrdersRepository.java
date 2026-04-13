package com.example.gmall.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.gmall.domain.Orders;

public interface OrdersRepository extends JpaRepository<Orders, Long> {
	
	// 회원별 주문 목록 조회 (최신순)
	Page<Orders> findByMemberIdOrderByCreatedAtDesc(Long memberId, Pageable pageable);

	// 회원별 주문 목록 조회 (seller fetch join)
	@Query("SELECT o FROM Orders o JOIN FETCH o.seller WHERE o.member.id = :memberId")
	Page<Orders> findByMemberIdWithSeller(@Param("memberId") Long memberId, Pageable pageable);
	
	// 판매자별 주문 목록 조회 (최신순)
	List<Orders> findBySellerIdOrderByCreatedAtDesc(Long sellerId);
	
	Page<Orders> findByMemberIdOrderByCreatedAtDescOrderIdDesc(Long sellerId, Pageable pageable);
	
	// 판매자 주문 관리 - 상태별 카운트
	long countBySellerIdAndStatus(Long sellerId, Byte status);

	Page<Orders> findBySellerIdOrderByCreatedAtDescOrderIdDesc(Long sellerId, Pageable pageable);
	
	// 판매자 주문 관리 - 상태 필터링 조회 추가
	Page<Orders> findBySellerIdAndStatusOrderByCreatedAtDesc(Long sellerId, Byte status, Pageable pageable);
	
	// 판매자 주문 관리 - 집계
	long countBySellerId(Long sellerId);
	
	// 관리자 페이지 주문 조회 필터
	@Query("SELECT o FROM Orders o " +
		       "JOIN FETCH o.member " +
		       "JOIN FETCH o.seller " +
		       "WHERE (:status IS NULL OR o.status = :status) " +
		       "AND (:keyword IS NULL OR o.member.mname LIKE %:keyword%) " +
		       "AND (:sellerName IS NULL OR o.seller.settlementName LIKE %:sellerName% " +
		       "     OR o.seller.mname LIKE %:sellerName%) " +
		       "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
		       "AND (:endDate IS NULL OR o.createdAt <= :endDate) " +
		       "ORDER BY o.createdAt DESC")
		Page<Orders> findAllWithFilters(
		        @Param("status") Byte status,
		        @Param("keyword") String keyword,
		        @Param("sellerName") String sellerName,
		        @Param("startDate") LocalDateTime startDate,
		        @Param("endDate") LocalDateTime endDate,
		        Pageable pageable
		);

	// 상태별 카운트
	long countByStatus(Byte status);
	long count(); // 전체 카운트 (JPA 기본 제공)
	
	// 주문 그룹핑
	List<Orders> findByOrderGroupId(String orderGroupId);
	
	// 오늘 주문 수
	long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

	// 오늘 매출 합계
	@Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Orders o " +
		       "WHERE o.createdAt BETWEEN :start AND :end " +
		       "AND o.status NOT IN (0, 4, 5)")
	Long sumTotalPriceByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
	
	// 판매자 페이지 - 판매자 오늘 주문 수
	long countBySellerIdAndCreatedAtBetween(Long sellerId, LocalDateTime start, LocalDateTime end);

	// 판매자 페이지 - 판매자 오늘 매출
	@Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Orders o " +
		       "WHERE o.seller.id = :sellerId " +
		       "AND o.createdAt BETWEEN :start AND :end " +
		       "AND o.status NOT IN (0, 4, 5)")
	Long sumTotalPriceBySellerIdAndCreatedAtBetween(@Param("sellerId") Long sellerId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
	
	// 관리자 페이지 - 판매자별 총 매출액
	@Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Orders o WHERE o.seller.id = :sellerId")
	Long sumTotalRevenueBySellerId(@Param("sellerId") Long sellerId);
	
	// 관리자 페이지 - 판매자별 실 매출액(결제전, 취소/환불, 결제 실패 제외)
	@Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Orders o WHERE o.seller.id = :sellerId AND o.status NOT IN (0, 4, 5)")
	Long sumRealRevenueBySellerId(@Param("sellerId") Long sellerId);
}
