package com.example.gmall.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.gmall.dto.board.PostDetailResponseDTO;
import com.example.gmall.dto.board.PostListResponseDTO;
import com.example.gmall.service.PostService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 1. [공지사항] 목록 조회
    @GetMapping("/notice")
    public ResponseEntity<Page<PostListResponseDTO>> getNoticeList(Pageable pageable) {
        return ResponseEntity.ok(postService.getNoticeList(pageable));
    }

    // 2. [고객문의] 목록 조회
    @GetMapping("/inquiry")
    public ResponseEntity<Page<PostListResponseDTO>> getInquiryList(Pageable pageable) {
        return ResponseEntity.ok(postService.getInquiryList(pageable));
    }
    
    // 3. [고객문의] 신규 등록
    @PostMapping("/inquiry")
    public ResponseEntity<Long> registerInquiry(@RequestBody PostDetailResponseDTO dto) {
        return ResponseEntity.ok(postService.register(dto));
    }
    
    // 4. [공통] 게시글 상세 조회 (경로 간소화)
    @GetMapping("/{id}")
    public ResponseEntity<PostDetailResponseDTO> getPost(@PathVariable("id") Long id) {
        return ResponseEntity.ok(postService.getPost(id));
    }

    // 5. [관리자] 답변 등록 (새로 추가!)
    @PostMapping("/{id}/answer")
    public ResponseEntity<String> addAnswer(@PathVariable("id") Long id, @RequestBody String answerContent) {
        postService.addAnswer(id, answerContent);
        return ResponseEntity.ok("답변이 성공적으로 등록되었습니다.");
    }

    // 6. [관리자/사용자] 게시글 삭제 (소프트 삭제 실행)
    @PostMapping("/{id}/remove")
    public ResponseEntity<String> removePost(@PathVariable("id") Long id) {
        postService.remove(id);
        return ResponseEntity.ok("게시글이 삭제 처리되었습니다.");
    }
}