package com.example.gmall.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.gmall.dto.board.PageResponseDTO;
import com.example.gmall.dto.board.PostDetailResponseDTO;
import com.example.gmall.dto.board.PostListResponseDTO;
import com.example.gmall.dto.board.PostRegisterRequestDTO;
import com.example.gmall.service.PostService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 1. [공지사항] 목록 조회
    @GetMapping("")
    public ResponseEntity<PageResponseDTO<PostListResponseDTO>> getNoticeList(
            @RequestParam(name = "keyword", required = false) String keyword, Pageable pageable) {
        return ResponseEntity.ok(postService.getBoardList(keyword, pageable));
    }

    // 2. [고객문의] 목록 조회
    @GetMapping("/inquiry")
    public ResponseEntity<PageResponseDTO<PostListResponseDTO>> getInquiryList(
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "hasAnswer", required = false) Boolean hasAnswer,
            @RequestParam(name = "isPublic", required = false) Boolean isPublic,
            Pageable pageable) {
        return ResponseEntity.ok(postService.getInquiryList(keyword, hasAnswer, isPublic, pageable));
    }

    // 3. [고객문의] 신규 등록
    @PostMapping("/inquiry")
    public ResponseEntity<Long> registerInquiry(
            @Valid @RequestBody PostRegisterRequestDTO dto) {
        return ResponseEntity.ok(postService.register(dto));
    }

    // 4. [공통] 게시글 상세 조회
    @GetMapping("/{postId}")
    public ResponseEntity<PostDetailResponseDTO> getPost(
            @PathVariable("postId") Long postId) {
        return ResponseEntity.ok(postService.getPost(postId));
    }

    // 5. [사용자] 게시글 수정
    @PutMapping("/inquiry/{postId}")
    public ResponseEntity<String> updatePost(
            @PathVariable("postId") Long postId,
            @Valid @RequestBody PostRegisterRequestDTO dto) {
        postService.updatePost(postId, dto);
        return ResponseEntity.ok("게시글이 수정되었습니다.");
    }

    // 6. [사용자] 게시글 삭제 (본인 글만)
    @DeleteMapping("/{postId}")
    public ResponseEntity<String> removePost(
            @PathVariable("postId") Long postId) {
        postService.remove(postId);
        return ResponseEntity.ok("게시글이 삭제 처리되었습니다.");
    }
}
