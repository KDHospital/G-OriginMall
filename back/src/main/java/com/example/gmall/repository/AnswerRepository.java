package com.example.gmall.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gmall.domain.Answer;
import com.example.gmall.domain.Member;
import com.example.gmall.domain.Post;

public interface AnswerRepository extends JpaRepository<Answer, Long>{
	
	//틀정 게시글에 달린 답변 조회(상세페이지용)
	Page<Answer> findByPost(Post post, Pageable pageable);

	//관리자가 작성한 답변들 페이징(관리자 답변 관리용)
	Page<Answer> findByMember(Member member, Pageable pageable);
	
	//답변 존재 여부 확인(와이어프레임 목록의 '답변완료' 배지 표시용)
	boolean existsByPost(Post post);
	
}
