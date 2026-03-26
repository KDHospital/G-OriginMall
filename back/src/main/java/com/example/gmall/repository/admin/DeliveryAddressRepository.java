package com.example.gmall.repository.member;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gmall.domain.DeliveryAddress;

public interface DeliveryAddressRepository extends JpaRepository<DeliveryAddress, Long>{
	
	//해당 회원의 배송지 목록 조회
	List<DeliveryAddress> findByMemberId(Long memberId);
}
