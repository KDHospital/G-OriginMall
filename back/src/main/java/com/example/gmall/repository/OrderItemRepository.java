package com.example.gmall.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.gmall.domain.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
	
	// 주문별 상품 목록 조회
	List<OrderItem> findByOrdersOrderId(Long orderId);
	
}
