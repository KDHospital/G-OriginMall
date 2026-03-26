package com.example.gmall.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gmall.domain.Board;
import com.example.gmall.domain.Post;

public interface PostRepository extends JpaRepository<Post, Long>{
	
	//특정 게시판의 글을 페이징하여 조회(공지사항/QnA)
	Page<Post> findByAndIsDeletedFalse(Board board, Pageable pageable);

	//제목 키워드 검색 + 페이징
	Page<Post> findByTitleContainingAndIsDeletedFalse(String title, Pageable pagealbe);
	
}
