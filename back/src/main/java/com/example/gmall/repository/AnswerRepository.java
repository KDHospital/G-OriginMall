package com.example.gmall.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gmall.domain.Answer;
import com.example.gmall.domain.Member;
import com.example.gmall.domain.Post;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
	
    // 1. 특정 게시글에 달린 '삭제되지 않은' 답변 조회
    Page<Answer> findByPostAndIsDeletedFalse(Post post, Pageable pageable);

    // 2. 관리자가 작성한 '삭제되지 않은' 답변들 페이징
    Page<Answer> findByMemberAndIsDeletedFalse(Member member, Pageable pageable);
	
    // 3. 답변 존재 여부 확인 (삭제된 답변은 제외하고 체크)
    // 이 메서드가 true여야 목록에서 '답변완료' 배지 노출
    boolean existsByPostAndIsDeletedFalse(Post post);
}