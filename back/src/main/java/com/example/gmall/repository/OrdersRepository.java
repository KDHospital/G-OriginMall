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
}
