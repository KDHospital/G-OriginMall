package com.example.gmall.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.gmall.dto.board.PostListResponseDTO;
import com.example.gmall.repository.PostRepository;
import com.example.gmall.service.PostService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    //공지사항 목록 조회
    @Override
    public Page<PostListResponseDTO> getNoticeList(Pageable pageable) {

    	return postRepository.getPostList(1, pageable);
    }

    //고객문의 목록 조회
    @Override
    public Page<PostListResponseDTO> getInquiryList(Pageable pageable) {
    	
        return postRepository.getPostList(2, pageable);
    }
}