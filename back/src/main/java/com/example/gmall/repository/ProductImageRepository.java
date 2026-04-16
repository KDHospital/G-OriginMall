package com.example.gmall.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gmall.domain.Product;
import com.example.gmall.domain.ProductImage;

public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {

    // 상품별 이미지 목록 (정렬 순서대로)
    List<ProductImage> findByProductProductIdOrderBySortOrderAsc(Long productId);

    // 상품 이미지 전체 삭제 (상품 수정 시 기존 이미지 초기화용)
    void deleteByProductProductId(Long productId);
    
    // 상품 수정 시 상세 이미지 처리
    void deleteByProductAndSortOrder(Product product, int sortOrder);
}