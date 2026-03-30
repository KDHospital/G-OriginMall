package com.example.gmall.dto.board;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostDetailResponseDTO {
	
	private Long postId;
	
	private String title;
	
	private String content;
	
	private String writerName;
	
	private LocalDateTime createdAt;
	
	private int viewCount;
	
	
	//고객 문의 답변 내용
	private String answerContent;
	
	private LocalDateTime answeredAt;
	
	// 답변 삭제 여부 추가 (소프트 삭제 대응)
    private boolean isDeleted;
	

}
