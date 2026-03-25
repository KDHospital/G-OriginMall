package com.example.gmall.service;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.example.gmall.dto.product.ProductCreateRequestDTO;
import com.example.gmall.dto.product.ProductListResponseDTO;

public interface ProductService {
	//웹-상품 목록 조회
	Page<ProductListResponseDTO> getProducts(Integer categoryId, int page, int size);
	//어드민-상품 등록

	
}
