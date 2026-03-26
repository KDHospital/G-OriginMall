package com.example.gmall.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "answer")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Answer {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long answerId;

    //문의 게시글ID
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
 
    // 답변은 admin만 작성 가능
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
 
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;
 
    // 0=ACTIVE, 1=DELETED (소프트 삭제)
    @Column(name = "is_deleted", columnDefinition = "BOOLEAN DEFAULT 0")
    @Builder.Default 
    private boolean isDeleted = false;
 
    @Column(name = "created_at", updatable = false, columnDefinition = "DATETIME DEFAULT NOW()")
    private LocalDateTime createdAt;
 
    @Column(name = "updated_at", columnDefinition = "DATETIME DEFAULT NOW()")
    private LocalDateTime updatedAt;
 
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
 
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
 // --- 비즈니스 로직 메서드 (Setter 대신 사용) ---
    
    //답변 내용 수정
    public void updateContent(String contnet) {
    	this.content = content;
    }
    
    //삭제 처리
    public void markAsDeleted() {
    	this.isDeleted = true;
    }
    
    
}
