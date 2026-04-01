package com.example.gmall.dto.board;

import java.time.LocalDateTime;

import com.example.gmall.domain.Post;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter 
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 외부에서 빈 객체 생성을 막습니다.
public class PostListResponseDTO {

    private Long postId;
    private String title;
    private String mname;
    private LocalDateTime createdAt;
    private Integer viewCount;
    private boolean isPublic;
    private boolean hasAnswer;

    // --- [핵심] Entity를 DTO로 변환하는 생성자 ---
    public PostListResponseDTO(Post post) {
        this.postId = post.getPostId();
        this.title = post.getTitle();
        
        // 작성자 이름 (Member 엔티티와 연동)
        this.mname = (post.getMember() != null) ? post.getMember().getMname() : "익명";
        
        this.createdAt = post.getCreatedAt();
        this.viewCount = (post.getViewCount() != null) ? post.getViewCount() : 0;
        this.isPublic = post.isPublic();
        
        // 답변 리스트가 비어있지 않으면 답변 완료(true) 처리
        this.hasAnswer = post.getAnswers() != null && !post.getAnswers().isEmpty();
    }
}