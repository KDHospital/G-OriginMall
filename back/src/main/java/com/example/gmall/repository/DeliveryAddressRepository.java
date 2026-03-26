package com.example.gmall.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gmall.domain.DeliveryAddress;

public interface DeliveryAddressRepository extends JpaRepository<DeliveryAddress, Long> {

	// 어드민 회원의 전체 배송지 목록 조회
    List<DeliveryAddress> findByMemberId(Long memberId);

    // 어드민 회원의 기본 배송지 조회 (단 1개)
    Optional<DeliveryAddress> findByMemberIdAndIsDefaultTrue(Long memberId);

    // 어드민 회원의 배송지 개수 조회 (최대 개수 제한 시 사용)
    int countByMemberId(Long memberId);
	
}
