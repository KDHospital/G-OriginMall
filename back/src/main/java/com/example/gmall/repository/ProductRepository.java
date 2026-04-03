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
	@Query("SELECT p FROM Product p " +
		       "JOIN FETCH p.category " +
		       "JOIN FETCH p.seller " +
		       "WHERE p.productId = :productId")
		Optional<Product> findByProductIdWithCategory(@Param("productId") Long productId);
	
	//전체 상품 목록, 가격필터
	@Query("SELECT p FROM Product p JOIN FETCH p.category c " +
		       "WHERE p.soldStatus = 0 " +
		       "AND (:categoryId IS NULL OR c.categoryId = :categoryId OR c.parent.categoryId = :categoryId) " +
		       "AND p.price >= :minPrice " +
		       "AND p.price <= :maxPrice")
		Page<Product> findActiveProducts(
		    @Param("categoryId") Integer categoryId,
		    @Param("minPrice") Integer minPrice,
		    @Param("maxPrice") Integer maxPrice,
		    Pageable pageable
		);
	
	// 판매자별 상품 목록 조회 (전체 상태 포함)
	Page<Product> findBySellerIdOrderByProductIdDesc(Long sellerId, Pageable pageable);
	
}
