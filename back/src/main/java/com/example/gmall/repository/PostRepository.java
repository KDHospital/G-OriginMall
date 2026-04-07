package com.example.gmall.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gmall.domain.Board;
import com.example.gmall.domain.Post;

public interface PostRepository extends JpaRepository<Post, Long>, PostRepositoryCustom {

	// 1. 특정 게시판의 '삭제되지 않은' 글 + 최신순 조회
	Page<Post> findByBoardAndIsDeletedFalseOrderByPostIdDesc(Board board, Pageable pageable);
	// 2. 제목 키워드 검색 + 삭제되지 않은 글
	Page<Post> findByTitleContainingAndIsDeletedFalse(String title, Pageable pageable);

	// 3. 특정 게시판의 '공개된' 글만 조회 (비밀글 제외 기획 대비)
	Page<Post> findByBoardAndIsPublicTrueAndIsDeletedFalse(Board board, Pageable pageable);

}
