package com.example.gmall.repository.board;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gmall.domain.Post;

public interface PostRepository extends JpaRepository<Post, Long>{

	
}
