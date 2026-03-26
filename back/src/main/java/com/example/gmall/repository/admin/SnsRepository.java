package com.example.gmall.repository.member;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.gmall.domain.Sns;

@Repository
public interface SnsRepository extends JpaRepository<Sns, Long>{
	
	//해당 회원의 SNS 연결 정보 조회
	List<Sns> findByMemberId(Long memberId);
	
}
