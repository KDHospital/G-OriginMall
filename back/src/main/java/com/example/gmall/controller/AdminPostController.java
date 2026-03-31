package com.example.gmall.controller;

import com.example.gmall.dto.board.PostDetailResponseDTO;
import com.example.gmall.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/board") // 관리자 전용 경로
@RequiredArgsConstructor
public class AdminPostController {

    private final PostService postService;

    // [관리자] 문의사항 답변 등록/수정
    // PUT 방식을 사용하여 기존 게시글에 답변 필드만 업데이트합니다.
    @PutMapping("/inquiry/{id}/answer")
    public ResponseEntity<Void> addAnswer(
            @PathVariable("id") Long id, 
            @RequestBody String answerContent) {
        
        postService.addAnswer(id, answerContent);
        return ResponseEntity.ok().build();
    }

    // [관리자] 게시글 삭제 (부적절한 게시글 관리)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removePost(@PathVariable("id") Long id) {
        postService.remove(id);
        return ResponseEntity.ok().build();
    }
}
