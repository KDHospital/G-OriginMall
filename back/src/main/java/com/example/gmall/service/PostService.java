package com.example.gmall.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.gmall.dto.board.PostDetailResponseDTO;
import com.example.gmall.dto.board.PostListResponseDTO;

public interface PostService {
	
	//[공통] 목록 조회
	Page<PostListResponseDTO> getNoticeList(Pageable pageable);
	Page<PostListResponseDTO> getInquiryList(Pageable pageable);
	
	// [사용자] 게시글 상세 조회 및 등록
    PostDetailResponseDTO getPost(Long id);
    Long register(PostDetailResponseDTO dto);
    
    // [관리자] 답변 등록 및 게시글 삭제
    void addAnswer(Long id, String answerContent);
    void remove(Long id);
	
}
