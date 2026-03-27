package com.example.gmall.service.impl;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.gmall.domain.Product;
import com.example.gmall.dto.product.ProductDetailResponseDTO;
import com.example.gmall.dto.product.ProductListResponseDTO;
import com.example.gmall.repository.ProductRepository;
import com.example.gmall.service.ProductService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    
    //웹-상품 목록 조회
	public Page<ProductListResponseDTO> getProducts(Integer categoryId, int page, int size){
		log.info("ProductServiceImpl 파일 내부의 getProducts 접근");
		Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC,"createdAt"));
		return productRepository.findActiveProducts(categoryId, pageable)
				.map(ProductListResponseDTO::new);
	}
	//웹-상품 상세 조회
    public ProductDetailResponseDTO getProduct(Long productId) {
        Product product = findProductOrThrow(productId);
        return new ProductDetailResponseDTO(product);
    }
    
    
    
    //공통 유틸
    private Product findProductOrThrow(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품: " + productId));
    }
	
}
