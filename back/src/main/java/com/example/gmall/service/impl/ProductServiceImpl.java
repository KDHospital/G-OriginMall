package com.example.gmall.service.impl;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.gmall.dto.ProductListResponseDTO;
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

	public Page<ProductListResponseDTO> getProducts(Integer categoryId, int page, int size){
		log.info("ProductServiceImpl 파일 내부의 getProducts 접근");
		Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC,"createdAt"));
		return productRepository.findActiveProducts(categoryId, pageable)
				.map(ProductListResponseDTO::new);
	}
	
}
