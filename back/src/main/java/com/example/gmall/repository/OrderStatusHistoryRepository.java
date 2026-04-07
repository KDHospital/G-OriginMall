package com.example.gmall.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.gmall.domain.OrderStatusHistory;

@Repository
public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Long> {
	
	// 주문별 상태 이력 조회 (최신순)
	List<OrderStatusHistory> findByOrdersOrderIdOrderByCreatedAtDesc(Long orderId);
	
}
