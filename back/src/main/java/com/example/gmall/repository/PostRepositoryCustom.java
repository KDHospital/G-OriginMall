package com.example.gmall.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.gmall.dto.board.PostListResponseDTO;

public interface PostRepositoryCustom {

	// 기본 목록
	Page<PostListResponseDTO> getPostList(Integer boardId, Pageable pageable);

	// 키워드 검색
	Page<PostListResponseDTO> getPostList(Integer boardId, String keyword, Pageable pageable);

	// 키워드 + 답변상태 + 공개여부 필터
	Page<PostListResponseDTO> getPostList(Integer boardId, String keyword, Boolean hasAnswer, Boolean isPublic, Pageable pageable);
}
