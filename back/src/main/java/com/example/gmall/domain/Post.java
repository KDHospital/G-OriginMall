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
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "post")
@Getter
@NoArgsConstructor
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
 
    @Column(name = "is_public", columnDefinition = "BOOLEAN DEFAULT 1")
    private boolean isPublic = true;
 
    @Column(name = "view_count", columnDefinition = "INT DEFAULT 0")
    private Integer viewCount = 0;
 
    // 0=ACTIVE, 1=DELETED (소프트 삭제)
    @Column(name = "is_deleted", columnDefinition = "BOOLEAN DEFAULT 0")
    private boolean isDeleted = false;
 
    @Column(name = "created_at", updatable = false, columnDefinition = "DATETIME DEFAULT NOW()")
    private LocalDateTime createdAt;
 
    @Column(name = "updated_at", columnDefinition = "DATETIME DEFAULT NOW()")
    private LocalDateTime updatedAt;
 
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
}
