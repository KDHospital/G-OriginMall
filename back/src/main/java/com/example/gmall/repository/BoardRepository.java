package com.example.gmall.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gmall.domain.Board;

public interface BoardRepository extends JpaRepository<Board, Integer>{

	Optional<Board> findByType(Byte type);
	
}
