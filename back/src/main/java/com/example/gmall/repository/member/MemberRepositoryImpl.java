package com.example.gmall.repository.member;

//import static com.example.gmall.domain.QMember.member;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import com.example.gmall.domain.Member;
import com.example.gmall.dto.MemberSearchCondition;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

//@Repository <-- 게시판 개발 부터!
@RequiredArgsConstructor
public class MemberRepositoryImpl {
	
	private final JPAQueryFactory queryFactory;


	public Page<Member> searchAdminMembers(MemberSearchCondition condition, Pageable pageable) {

		/* 게시판 개발 부터! QMember에러 인식 문제 해결 필요
		 * // 1. 실제 데이터 조회
		 * 
		 * List<Member> content = queryFactory .selectFrom(member) .where(
		 * searchKeywordEq(condition.getSearchKeyword()), roleEq(condition.getRole()),
		 * createdAtBetween(condition.getStartDate(), condition.getEndDate()) )
		 * .offset(pageable.getOffset()) .limit(pageable.getPageSize())
		 * .orderBy(member.createdAt.desc()) .fetch();
		 * 
		 * 
		 * // 2. 전체 개수 조회 long total =
		 * queryFactory.selectFrom(member).where(searchKeywordEq(condition.
		 * getSearchKeyword()), roleEq(condition.getRole()),
		 * createdAtBetween(condition.getStartDate(), condition.getEndDate()))
		 * .fetchCount();
		 * 
		 * return new PageImpl<>(content, pageable, total);
		 */
		
		//에러를 없애기 위해 빈 페이지를 반환하도록 설정
		return Page.empty(pageable);
	
	}

	// 이름 또는 아이디 검색
	/*
	 * private BooleanExpression searchKeywordEq(String keyword) { return
	 * StringUtils.hasText(keyword) ?
	 * member.loginId.contains(keyword).or(member.mname.contains(keyword)) : null; }
	 * 
	 * // 역할 필터링 (0:USER, 1:SELLER, 2:ADMIN) private BooleanExpression roleEq(Byte
	 * role) { return role != null ? member.role.eq(role) : null; }
	 * 
	 * // 가입일 기간 검색 private BooleanExpression createdAtBetween(LocalDate start,
	 * LocalDate end) { if (start == null && end == null) return null; LocalDateTime
	 * startDT = (start != null) ? start.atStartOfDay() : LocalDateTime.of(1990, 1,
	 * 1, 0, 0); LocalDateTime endDT = (end != null) ? end.atTime(LocalTime.MAX) :
	 * LocalDateTime.now(); return member.createdAt.between(startDT, endDT); }
	 */
}