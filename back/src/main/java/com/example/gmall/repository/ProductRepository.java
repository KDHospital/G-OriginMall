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
	
	// 판매자별 판매상태별 상품 수
	long countBySellerIdAndSoldStatus(Long sellerId, Byte soldStatus);
	
	
	// ── 판매량 정렬용 쿼리 (전체 상품) ──────────────────────────────────────
	// 판매량 낮은순
	@Query("SELECT p FROM Product p " +
	       "JOIN FETCH p.category c " +
	       "JOIN FETCH p.seller " +
	       "LEFT JOIN OrderItem oi ON oi.product = p " +  // 🔥 엔티티 기준으로 수정
	       "WHERE p.soldStatus = 0 " +
	       "AND (:categoryId IS NULL OR c.categoryId = :categoryId OR c.parent.categoryId = :categoryId) " +
	       "AND p.price >= :minPrice AND p.price <= :maxPrice " +
	       "GROUP BY p " +   // 🔥 productId 말고 p로
	       "ORDER BY COALESCE(SUM(oi.quantity), 0) ASC")
	Page<Product> findActiveProductsOrderBySalesAsc(
	    @Param("categoryId") Integer categoryId,
	    @Param("minPrice") Integer minPrice,
	    @Param("maxPrice") Integer maxPrice,
	    Pageable pageable
	);
	// 판매량 높은순
	@Query("SELECT p FROM Product p " +
	       "JOIN FETCH p.category c " +
	       "JOIN FETCH p.seller " +
	       "LEFT JOIN OrderItem oi ON oi.product = p " +
	       "WHERE p.soldStatus = 0 " +
	       "AND (:categoryId IS NULL OR c.categoryId = :categoryId OR c.parent.categoryId = :categoryId) " +
	       "AND p.price >= :minPrice AND p.price <= :maxPrice " +
	       "GROUP BY p " +
	       "ORDER BY COALESCE(SUM(oi.quantity), 0) DESC")
	Page<Product> findActiveProductsOrderBySalesDesc(
	    @Param("categoryId") Integer categoryId,
	    @Param("minPrice") Integer minPrice,
	    @Param("maxPrice") Integer maxPrice,
	    Pageable pageable
	);	
	
	// ── 판매량 정렬용 쿼리 (금빛나루 인증 상품) ──────────────────────────────────────
	// 판매량 낮은순
	@Query("SELECT p FROM Product p " +
	       "JOIN FETCH p.category c " +
	       "JOIN FETCH p.seller " +
	       "LEFT JOIN OrderItem oi ON oi.product = p " +
	       "WHERE p.soldStatus = 0 " +
	       "AND p.isCertified = true " +   
	       "AND (:categoryId IS NULL OR c.categoryId = :categoryId OR c.parent.categoryId = :categoryId) " +
	       "AND p.price >= :minPrice AND p.price <= :maxPrice " +
	       "GROUP BY p " +
	       "ORDER BY COALESCE(SUM(oi.quantity), 0) ASC")
	Page<Product> findCertifiedProductsOrderBySalesAsc(
	    @Param("categoryId") Integer categoryId,
	    @Param("minPrice") Integer minPrice,
	    @Param("maxPrice") Integer maxPrice,
	    Pageable pageable
	);
	// 판매량 높은순
	@Query("SELECT p FROM Product p " +
	       "JOIN FETCH p.category c " +
	       "JOIN FETCH p.seller " +
	       "LEFT JOIN OrderItem oi ON oi.product = p " +
	       "WHERE p.soldStatus = 0 " +
	       "AND p.isCertified = true " +   // 🔥 이것도 반드시 추가
	       "AND (:categoryId IS NULL OR c.categoryId = :categoryId OR c.parent.categoryId = :categoryId) " +
	       "AND p.price >= :minPrice AND p.price <= :maxPrice " +
	       "GROUP BY p " +
	       "ORDER BY COALESCE(SUM(oi.quantity), 0) DESC")
	Page<Product> findCertifiedProductsOrderBySalesDesc(
	    @Param("categoryId") Integer categoryId,
	    @Param("minPrice") Integer minPrice,
	    @Param("maxPrice") Integer maxPrice,
	    Pageable pageable
	);
	// ── 판매량 정렬용 쿼리 (기획전 인증 상품) ─────────────────────────────

	// 판매량 낮은순
	@Query("SELECT p FROM Product p " +
	       "JOIN FETCH p.category c " +
	       "JOIN FETCH p.seller " +
	       "LEFT JOIN OrderItem oi ON oi.product = p " +
	       "WHERE p.soldStatus = 0 " +
	       "AND p.isExhibition = true " +   
	       "AND (:categoryId IS NULL OR c.categoryId = :categoryId OR c.parent.categoryId = :categoryId) " +
	       "AND p.price >= :minPrice AND p.price <= :maxPrice " +
	       "GROUP BY p " +
	       "ORDER BY COALESCE(SUM(oi.quantity), 0) ASC")
	Page<Product> findExhibitionProductsOrderBySalesAsc(
	    @Param("categoryId") Integer categoryId,
	    @Param("minPrice") Integer minPrice,
	    @Param("maxPrice") Integer maxPrice,
	    Pageable pageable
	);


	// 판매량 높은순
	@Query("SELECT p FROM Product p " +
	       "JOIN FETCH p.category c " +
	       "JOIN FETCH p.seller " +
	       "LEFT JOIN OrderItem oi ON oi.product = p " +
	       "WHERE p.soldStatus = 0 " +
	       "AND p.isExhibition = true " +   
	       "AND (:categoryId IS NULL OR c.categoryId = :categoryId OR c.parent.categoryId = :categoryId) " +
	       "AND p.price >= :minPrice AND p.price <= :maxPrice " +
	       "GROUP BY p " +
	       "ORDER BY COALESCE(SUM(oi.quantity), 0) DESC")
	Page<Product> findExhibitionProductsOrderBySalesDesc(
	    @Param("categoryId") Integer categoryId,
	    @Param("minPrice") Integer minPrice,
	    @Param("maxPrice") Integer maxPrice,
	    Pageable pageable
	);
	
	
}
