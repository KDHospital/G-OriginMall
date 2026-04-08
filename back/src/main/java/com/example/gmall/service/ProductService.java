package com.example.gmall.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.gmall.dto.product.ProductCreateRequestDTO;
import com.example.gmall.dto.product.ProductDetailResponseDTO;
import com.example.gmall.dto.product.ProductListResponseDTO;
import com.example.gmall.dto.product.ProductRequestDTO;
import com.example.gmall.dto.product.ProductResponseDTO;

public interface ProductService {
	//웹-상품 목록 조회
	Page<ProductListResponseDTO> getProducts(Integer categoryId, int minPrice, int maxPrice, String sort, int page, int size);
	
	//웹-상품 상세 조회
    ProductDetailResponseDTO getProduct(Long productId);
    
    //웹-금빛나루 인증 목록 조회
    Page<ProductListResponseDTO> getCertifiedProducts(Integer categoryId,int minPrice, int maxPrice, String sort, int page, int size);
	//웹-기획전 목록 조회
    Page<ProductListResponseDTO> getExhibitionProducts(Integer categoryId,int minPrice, int maxPrice, String sort, int page, int size);
    
	// 상품 등록 (판매자/어드민 공용)
    ProductResponseDTO register(Long sellerId, ProductRequestDTO dto);
    
    // 판매자별 상품 목록 조회 (전체 상태 포함)
    Page<ProductResponseDTO> getSellerProducts(Long sellerId, Pageable pageable);

	// 상품 수정 (판매자/어드민 공용)
    ProductResponseDTO modify(Long productId, ProductRequestDTO dto);
    
    //재고처리
    void decreaseStock(Long productId, int quantity);
    
    //어드민- 상품 목록 조회
    Page<ProductListResponseDTO> getAdminProducts(Pageable pageable);
    Page<ProductListResponseDTO> searchAdminProducts(
        String keyword, Integer categoryId, String sellerName,
        Byte soldStatus, Boolean certified, Boolean exhibition,
        int page, int size
    );
}
