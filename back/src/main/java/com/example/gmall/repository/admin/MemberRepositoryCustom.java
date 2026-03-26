package com.example.gmall.repository.member;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.gmall.domain.Member;
import com.example.gmall.dto.MemberSearchCondition;

public interface MemberRepositoryCustom {

	//다양한 검색 조건을 담은 SeachDTO를 받아서 페이징 처리된 결과를 반환
	Page<Member> searchMembers(MemberSearchCondition condition, Pageable pageable);
	
	
}
