package com.example.gmall.domain;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "board")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Board {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer boardId;

    //게시판 제목
    @Column(name = "name", length = 20, nullable = false)
    private String name; // 공지사항 / QnA
 
    //게시판 타입 0=NOTICE, 1=QNA
    @Column(name = "type", nullable = false)
    private Byte type;
 
    //게시판 생성일
    @Column(name = "created_at", updatable = false, columnDefinition = "DATE DEFAULT (CURRENT_DATE)")
    private LocalDate createdAt;
 
    @Builder.Default
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts = new ArrayList<>();
 

    
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDate.now();
    }
    
	 // --- 비즈니스 로직 메서드 (Setter 대신 사용) ---
	
	 // 1. 게시판 이름 변경 (유효성 검사 추가)
	 public void updateName(String name) {
	     if (name == null || name.trim().isEmpty()) {
	         throw new IllegalArgumentException("게시판 이름은 비어있을 수 없습니다.");
	     }
	     this.name = name;
	 }
	
	// 2. 게시물 추가 (Post 엔티티 수정 후 에러 사라짐)
	 public void addPost(Post post) {
	     this.posts.add(post);
	     if (post.getBoard() != this) {
	         post.updateBoard(this); 
	     }
	 
	 }
	 
    
}
