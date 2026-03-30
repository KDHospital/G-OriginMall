package com.example.gmall.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.gmall.domain.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
	//전체 상품 목록, ACTIVE 상태만 조회
	@Query("SELECT p FROM Product p JOIN FETCH p.category "
			+"WHERE p.soldStatus = 0 "
			+"AND (:categoryId IS NULL OR p.category.categoryId = :categoryId)")
	Page<Product> findActiveProducts(@Param("categoryId") Integer categoryId,Pageable pageable);
	//상세 조회
	@Query("SELECT p FROM Product p JOIN FETCH p.category WHERE p.productId = :productId")
    Optional<Product> findByProductIdWithCategory(@Param("productId") Long productId);
}
