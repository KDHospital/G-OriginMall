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
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sns")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Sns {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long snsId;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
 
    @Column(name = "provider", length = 20, nullable = false)
    private String provider; // kakao / naver
 
    @Column(name = "provider_user_id", length = 255, unique = true, nullable = false)
    private String providerUserId;
 
    @Column(name = "linked_at", columnDefinition = "DATETIME DEFAULT NOW()")
    private LocalDateTime linkedAt;
 
    @PrePersist
    public void prePersist() {
        this.linkedAt = LocalDateTime.now();
    }
}
