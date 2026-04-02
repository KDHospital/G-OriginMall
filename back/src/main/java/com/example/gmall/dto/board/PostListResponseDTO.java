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
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PostListResponseDTO {

    private Long postId;
    private String title;
    private String mname;
    private String loginId; 
    private LocalDateTime createdAt;
    private Integer viewCount;
    private boolean isPublic;
    private boolean hasAnswer;
    private String content;

    public PostListResponseDTO(Post post) {
        this.postId = post.getPostId();
        this.title = post.getTitle();
        
        // 작성자 정보 매핑
        if (post.getMember() != null) {
            this.mname = post.getMember().getMname();
            this.loginId = post.getMember().getLoginId(); 
        } else {
            this.mname = "익명";
            this.loginId = null;
        }
        
        this.content = post.getContent();
        this.createdAt = post.getCreatedAt();
        this.viewCount = (post.getViewCount() != null) ? post.getViewCount() : 0;
        this.isPublic = post.isPublic();
        this.hasAnswer = post.getAnswers() != null && !post.getAnswers().isEmpty();
    }
}