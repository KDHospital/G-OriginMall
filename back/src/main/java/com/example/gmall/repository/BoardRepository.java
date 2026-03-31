package com.example.gmall.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.gmall.domain.Board;

public interface BoardRepository extends JpaRepository<Board, Integer> {

    // 1. 타입으로 게시판 찾기 (현재 코드 유지)
    Optional<Board> findByType(Byte type);

    // 2. [추가 추천] 게시판 이름으로 찾기 
    // 서비스 로직에서 "NOTICE", "QNA" 등으로 명확하게 구분할 때 매우 유용합니다.
    Optional<Board> findByName(String name);
}