package com.example.gmall.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.gmall.domain.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

	//전체 상품 목록, 가격필터
	@Query("SELECT p FROM Product p JOIN FETCH p.category c " + "JOIN FETCH p.seller " +  
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
	
	//상세 조회
	@Query("SELECT p FROM Product p " +
		       "JOIN FETCH p.category " +
		       "JOIN FETCH p.seller " +
		       "WHERE p.productId = :productId")
		Optional<Product> findByProductIdWithCategory(@Param("productId") Long productId);
	
	//금빛나루 전용관
	@Query("SELECT p FROM Product p JOIN FETCH p.category c " + "JOIN FETCH p.seller " +  
		       "WHERE p.soldStatus = 0 AND p.isCertified = true " +
		       "AND (:categoryId IS NULL OR c.categoryId = :categoryId OR c.parent.categoryId = :categoryId) " +
		       "AND p.price >= :minPrice " +
		       "AND p.price <= :maxPrice")
		Page<Product> findCertifiedProducts(
		    @Param("categoryId") Integer categoryId,
		    @Param("minPrice") Integer minPrice,
		    @Param("maxPrice") Integer maxPrice,
		    Pageable pageable
		);
	
	//기획전 전용관
	@Query("SELECT p FROM Product p JOIN FETCH p.category c " + "JOIN FETCH p.seller " +  
		       "WHERE p.soldStatus = 0 AND p.isExhibition = true " +
		       "AND (:categoryId IS NULL OR c.categoryId = :categoryId OR c.parent.categoryId = :categoryId) " +
		       "AND p.price >= :minPrice " +
		       "AND p.price <= :maxPrice")
		Page<Product> findExhibitionProducts(
		    @Param("categoryId") Integer categoryId,
		    @Param("minPrice") Integer minPrice,
		    @Param("maxPrice") Integer maxPrice,
		    Pageable pageable
		);
	// 판매자별 상품 목록 조회 (전체 상태 포함)
	Page<Product> findBySellerIdOrderByProductIdDesc(Long sellerId, Pageable pageable);

	// 판매자별 상품 수
	long countBySellerId(Long sellerId);
	
	//상품 수정
	boolean existsByProductIdAndSeller_Id(Long productId, Long sellerId);
	
	// 관리자 대시보드 => 판매중 상품 수
	long countBySoldStatus(Byte soldStatus);
	//어드민- 상품목록 조회
	Page<Product> findAllByOrderByProductIdDesc(Pageable pageable);
	
	// 어드민 검색 쿼리 (상품명, 카테고리, 판매자명, 판매상태, 인증여부 필터)
	@Query("SELECT p FROM Product p " +
	       "JOIN FETCH p.category c " +
	       "JOIN FETCH p.seller s " +
	       "WHERE (:keyword IS NULL OR p.pname LIKE %:keyword%) " +
	       "AND (:categoryId IS NULL OR c.categoryId = :categoryId OR c.parent.categoryId = :categoryId) " +
	       "AND (:sellerName IS NULL OR s.mname LIKE %:sellerName%) " +
	       "AND (:soldStatus IS NULL OR p.soldStatus = :soldStatus) " +
	       "AND (:certified IS NULL OR p.isCertified = :certified) " +
	       "AND (:exhibition IS NULL OR p.isExhibition = :exhibition)")
	Page<Product> searchAdminProducts(
	    @Param("keyword")    String keyword,
	    @Param("categoryId") Integer categoryId,
	    @Param("sellerName") String sellerName,
	    @Param("soldStatus") Byte soldStatus,
	    @Param("certified")  Boolean certified,
	    @Param("exhibition") Boolean exhibition,
	    Pageable pageable
	);	
	
}
