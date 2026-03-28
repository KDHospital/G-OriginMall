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
public class PostListResponseDTO {

	private Long postId;
	
	private String title;
	
	private String writerName;
	
	private LocalDateTime createdAt;
	
	private int viewCount;
	
	private boolean ispublic;
	
	private boolean hasAnswer;
}
