package com.example.gmall.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.gmall.dto.board.PostListResponseDTO;
import com.example.gmall.service.PostService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/admin/board")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService; // 인터페이스 주입

    @GetMapping("/notice")
    public ResponseEntity<Page<PostListResponseDTO>> getNoticeList(Pageable pageable) {
        return ResponseEntity.ok(postService.getNoticeList(pageable));
    }

    @GetMapping("/inquiry")
    public ResponseEntity<Page<PostListResponseDTO>> getInquiryList(Pageable pageable) {
        return ResponseEntity.ok(postService.getInquiryList(pageable));
    }
}