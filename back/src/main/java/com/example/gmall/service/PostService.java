package com.example.gmall.service;

import org.springframework.data.domain.Pageable;

import com.example.gmall.dto.board.PageResponseDTO;
import com.example.gmall.dto.board.PostDetailResponseDTO;
import com.example.gmall.dto.board.PostListResponseDTO;
import com.example.gmall.dto.board.PostRegisterRequestDTO;

public interface PostService {
	
	//[사이트] 목록 조회 (공개 글만)
	PageResponseDTO<PostListResponseDTO> getBoardList(String keyword, Pageable pageable);
	PageResponseDTO<PostListResponseDTO> getInquiryList(String keyword, Boolean hasAnswer, Boolean isPublic, Pageable pageable);

	// [사용자] 게시글 상세 조회 및 등록
    PostDetailResponseDTO getPost(Long id);
    Long register(PostRegisterRequestDTO dto);

    // [사용자] 게시글 수정
    void updatePost(Long id, PostRegisterRequestDTO dto);

    // [관리자] 답변 등록 및 게시글 삭제
    void addAnswer(Long id, String answerContent);
    void remove(Long id);

    // [관리자] 목록/상세 조회 (비공개 포함 전체 조회 가능)
    PageResponseDTO<PostListResponseDTO> getBoardListForAdmin(String keyword, Pageable pageable);
    PageResponseDTO<PostListResponseDTO> getInquiryListForAdmin(String keyword, Boolean hasAnswer, Boolean isPublic, Pageable pageable);
    PostDetailResponseDTO getPostForAdmin(Long id);
	
}
