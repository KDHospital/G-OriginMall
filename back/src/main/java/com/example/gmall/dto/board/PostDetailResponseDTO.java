package com.example.gmall.dto.board;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.example.gmall.domain.Post;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PostDetailResponseDTO {

    private Long postId;
    private String title;
    private String content;
    private String MName;
    private LocalDateTime createdAt;
    private Integer viewCount;
    private boolean isPublic;
    
    // 상세 페이지이므로 답변 리스트를 포함합니다.
    private List<AnswerResponseDTO> answers;

    // --- [핵심] Entity를 DTO로 변환하는 생성자 ---
    public PostDetailResponseDTO(Post post) {
        this.postId = post.getPostId();
        this.title = post.getTitle();
        this.content = post.getContent();
        
        // 작성자 정보 (Member 엔티티 연동)
        this.MName = (post.getMember() != null) ? post.getMember().getMname() : "익명";
        
        this.createdAt = post.getCreatedAt();
        this.viewCount = (post.getViewCount() != null) ? post.getViewCount() : 0;
        this.isPublic = post.isPublic();
        
        // Post 엔티티의 List<Answer>를 AnswerResponseDTO 리스트로 변환
        if (post.getAnswers() != null) {
            this.answers = post.getAnswers().stream()
                    .map(AnswerResponseDTO::new)
                    .collect(Collectors.toList());
        }
    }
}