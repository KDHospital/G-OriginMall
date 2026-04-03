package com.example.gmall.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gmall.domain.Orders;

public interface OrdersRepository extends JpaRepository<Orders, Long> {
	
	// 회원별 주문 목록 조회 (최신순)
	Page<Orders> findByMemberIdOrderByCreatedAtDesc(Long memberId, Pageable pageable);
	
	// 판매자별 주문 목록 조회 (최신순)
	List<Orders> findBySellerIdOrderByCreatedAtDesc(Long sellerId);
	
	Page<Orders> findBySellerIdOrderByCreatedAtDesc(Long sellerId, Pageable pageable);
	
	// 판매자 주문 관리 - 상태별 카운트
	long countBySellerIdAndStatus(Long sellerId, Byte status);

	// 판매자 주문 관리 - 상태 필터링 조회 추가
	Page<Orders> findBySellerIdAndStatusOrderByCreatedAtDesc(Long sellerId, Byte status, Pageable pageable);
	
	// 판매자 주문 관리 - 집계
	long countBySellerId(Long sellerId);
}
