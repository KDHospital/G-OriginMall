package com.example.gmall.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "banner")
@Getter
@Setter
@NoArgsConstructor
public class Banner {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bannerId;
 
    @Column(name = "image_url", length = 255, nullable = false)
    private String imageUrl;
 
    @Column(name = "link_url", length = 255)
    private String linkUrl;
 
    @Column(name = "sort_order", columnDefinition = "INT DEFAULT 0")
    private Integer sortOrder = 0;
 
    @Column(name = "is_active", columnDefinition = "TINYINT(1) DEFAULT 1")
    private boolean isActive = true;
 
    @Column(name = "created_at", updatable = false, columnDefinition = "DATETIME DEFAULT NOW()")
    private LocalDateTime createdAt;
 
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
