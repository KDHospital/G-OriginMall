package com.example.gmall.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gmall.domain.Board;

public interface BoardRepository extends JpaRepository<Board, Integer>{

	List<Board> findByType(Byte type);
	
}
