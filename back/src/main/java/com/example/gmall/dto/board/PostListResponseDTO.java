package com.example.gmall.dto.board;

import java.time.LocalDateTime;
import com.example.gmall.domain.Post;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostListResponseDTO {

    private Long postId;
    private String title;
    private String mName;
    private String loginId;
    private LocalDateTime createdAt;
    private Integer viewCount;
    private String content;
    private boolean hasAnswer;
    private Long memberId;

    @JsonProperty("isPublic")
    private boolean isPublic;

    public static PostListResponseDTO from(Post post) {

        PostListResponseDTOBuilder builder = PostListResponseDTO.builder()
                .postId(post.getPostId())
                .title(post.getTitle())
                .content(post.getContent())
                .createdAt(post.getCreatedAt())
                .viewCount(post.getViewCount() != null ? post.getViewCount() : 0)
                .isPublic(post.isPublic())
                .hasAnswer(post.getAnswers() != null && !post.getAnswers().isEmpty());

        if (post.getMember() != null) {
            builder.mName(post.getMember().getMname())
                   .loginId(post.getMember().getLoginId())
                   .memberId(post.getMember().getId());
        } else {
            builder.mName("익명")
                   .loginId(null)
                   .memberId(null);
        }

        return builder.build();
    }
}