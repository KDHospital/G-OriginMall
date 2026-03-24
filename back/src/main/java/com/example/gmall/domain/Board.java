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
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "board")
@Getter
@NoArgsConstructor
public class Board {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer boardId;
 
    @Column(name = "name", length = 20, nullable = false)
    private String name; // 공지사항 / QnA
 
    // 0=NOTICE, 1=QNA
    @Column(name = "type", nullable = false)
    private Byte type;
 
    @Column(name = "created_at", updatable = false, columnDefinition = "DATE DEFAULT (CURRENT_DATE)")
    private LocalDate createdAt;
 
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts = new ArrayList<>();
 
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDate.now();
    }
}
