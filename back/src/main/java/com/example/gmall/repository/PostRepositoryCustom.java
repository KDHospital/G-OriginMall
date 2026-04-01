package com.example.gmall.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.gmall.dto.board.PostListResponseDTO;

public interface PostRepositoryCustom {

	//공지사항 문의글 고객목록을 페이징 처리하여 DTO로 가져오기
	Page<PostListResponseDTO> getPostList(Integer boardId, Pageable pageable);
}
