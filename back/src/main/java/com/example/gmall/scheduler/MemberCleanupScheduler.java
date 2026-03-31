package com.example.gmall.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.gmall.domain.Member;
import com.example.gmall.repository.MemberRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class MemberCleanupScheduler {

	private final MemberRepository memberRepository;
	
	// 매일 새벽 4시에 실행 (Cron 표현식 : 초 분 시 일 월 요일)
	@Scheduled(cron = "0 0 4 * * *")
	@Transactional
	public void daleteExpirdeMembers() {
		LocalDateTime oneYearAgo = LocalDateTime.now().minusYears(1);
		
		List<Member> targetMembers = memberRepository.findByIsDeletedTrueAndWithdrawAtBefore(oneYearAgo);
		
		if(!targetMembers.isEmpty()) {
			memberRepository.deleteAll(targetMembers);
			log.info("정기 데이터 정리: 1년 경과 탈퇴 회원 {}명 영구 삭제 완료",targetMembers.size());
		}
	}
}
