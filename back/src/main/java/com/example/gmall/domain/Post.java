package com.example.gmall.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "post")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
 
    @Column(name = "title", length = 200, nullable = false)
    private String title;
 
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;
 
    @Builder.Default
    @Column(name = "is_public", columnDefinition = "BOOLEAN DEFAULT 1")
    private boolean isPublic = true;
 
    @Builder.Default
    @Column(name = "view_count", columnDefinition = "INT DEFAULT 0")
    private Integer viewCount = 0;
 
    // 0=ACTIVE, 1=DELETED (소프트 삭제)
    @Builder.Default
    @Column(name = "is_deleted", columnDefinition = "BOOLEAN DEFAULT 0")
    private boolean isDeleted = false;
 
    @Column(name = "created_at", updatable = false, columnDefinition = "DATETIME DEFAULT NOW()")
    private LocalDateTime createdAt;
 
    @Column(name = "updated_at", columnDefinition = "DATETIME DEFAULT NOW()")
    private LocalDateTime updatedAt;
 
    @Builder.Default
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Answer> answers = new ArrayList<>();
 
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
 
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    
 // 추가  --- 비즈니스 메서드 (Setter 대신 사용) ---
    
	 // 1. [상태 관리] 소프트 삭제 처리
	 public void changeDeleteStatus(boolean isDeleted) {
	     this.isDeleted = isDeleted;
	 }
	
	 // 2. [답변 관리] 답변 추가 및 양방향 연결
	 public void addAnswer(Answer answer) {
	     if (this.answers == null) {
	         this.answers = new ArrayList<>();
	     }
	     this.answers.add(answer);
	     
	     // 양방향 관계 설정
	     if (answer.getPost() != this) {
	         answer.updatePost(this); // Answer 엔티티에도 updatePost 메서드가 필요
	     }
	 }
	 
	
	 // 3. [조회수 관리] 조회수 증가 로직
	 public void incrementViewCount() {
	     if (this.viewCount == null) {
	         this.viewCount = 0;
	     }
	     this.viewCount++;
	 }
	 
	
	 // 4. [수정 관리] 게시글 내용 업데이트
	 // 제목, 본문, 공개 여부를 한 번에 수정하는 통합 메서드
	 public void updatePost(String title, String content, boolean isPublic) {
	     this.title = title;
	     this.content = content;
	     this.isPublic = isPublic;
	     // @PreUpdate에 의해 updatedAt은 자동으로 갱신
	 }
	 
	 
	 public void updateMember(Member member) {
		    this.member = member;
	 }
	 
	 public void updateBoard(Board board) {
		    this.board = board;
		}
}
