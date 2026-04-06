package com.example.gmall.dto.board;

import java.time.LocalDateTime;

import com.example.gmall.domain.Answer;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AnswerResponseDTO {

    private Long answerId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AnswerResponseDTO from(Answer answer) {
        return AnswerResponseDTO.builder()
                .answerId(answer.getAnswerId())
                .content(answer.getContent())
                .createdAt(answer.getCreatedAt())
                .updatedAt(answer.getUpdatedAt())
                .build();
    }
}