package com.example.gmall.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.gmall.dto.board.PostListResponseDTO;

public interface PostService {
	
	//공지사항 목록 조회
	Page<PostListResponseDTO> getNoticeList(Pageable pageable);
	
	//고객문의 목록 조회
	Page<PostListResponseDTO> getInquiryList(Pageable pageable);
}
