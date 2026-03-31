package com.example.gmall.dto.board;

import com.example.gmall.domain.Answer;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AnswerResponseDTO {
    private Long answerId;
    private String content;
    private String adminName; // 답변자(관리자) 이름

    public AnswerResponseDTO(Answer answer) {
        this.answerId = answer.getAnswerId();
        this.content = answer.getContent();
        this.adminName = (answer.getMember() != null) ? answer.getMember().getMname() : "관리자";
    }
}