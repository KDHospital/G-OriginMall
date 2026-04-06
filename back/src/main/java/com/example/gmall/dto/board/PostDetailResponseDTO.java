package com.example.gmall.dto.board;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.example.gmall.domain.Post;
import com.fasterxml.jackson.annotation.JsonProperty;

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
    private Integer boardId;
    private String title;
    private String content;
    private String mName;
    private LocalDateTime createdAt;
    private Integer viewCount;

    @JsonProperty("isPublic")
    private boolean isPublic;

    private Long memberId;

    private List<AnswerResponseDTO> answers;

    public static PostDetailResponseDTO from(Post post) {

        List<AnswerResponseDTO> answerList = Collections.emptyList();

        if (post.getAnswers() != null) {
            answerList = post.getAnswers().stream()
                    .filter(a -> !a.isDeleted())   // 삭제된 답변 제외
                    .map(AnswerResponseDTO::from) 
                    .collect(Collectors.toList());
        }

        return PostDetailResponseDTO.builder()
                .postId(post.getPostId())
                .boardId(post.getBoard() != null ? post.getBoard().getBoardId() : null)
                .title(post.getTitle())
                .content(post.getContent())
                .mName(post.getMember() != null ? post.getMember().getMname() : "익명")
                .memberId(post.getMember() != null ? post.getMember().getId() : null)
                .createdAt(post.getCreatedAt())
                .viewCount(post.getViewCount() != null ? post.getViewCount() : 0)
                .isPublic(post.isPublic())
                .answers(answerList)
                .build();
    }
}