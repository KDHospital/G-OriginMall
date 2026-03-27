package com.example.gmall.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.gmall.dto.product.ProductDetailResponseDTO;
import com.example.gmall.dto.product.ProductListResponseDTO;
import com.example.gmall.dto.product.ProductRequestDTO;
import com.example.gmall.dto.product.ProductResponseDTO;
import com.example.gmall.service.ProductService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api")
public class ProductController {

	private final ProductService productService;
	
    // 상품 전체/카테고리별 목록
    // GET /api/products?page=0&size=12&categoryId=1
    @GetMapping("/products")
    public ResponseEntity<Page<ProductListResponseDTO>> getProducts(
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "page",defaultValue = "0")  int page,
            @RequestParam(value = "size",defaultValue = "12") int size) {
        return ResponseEntity.ok(productService.getProducts(categoryId, page, size));
    }
    
    // 판매자 상품 등록
    // ── JWT 적용 완료 ─────────────────────────────────────────────────
    @PostMapping(value = "/seller/products",
                 consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponseDTO> register(
            Authentication authentication,
            @ModelAttribute ProductRequestDTO dto
    ) {
        Long sellerId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(productService.register(sellerId, dto));
    }

    // 어드민 상품 등록 (기획전용)
    @PostMapping(value = "/admin/products",
                 consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponseDTO> registerByAdmin(
            Authentication authentication,
            @ModelAttribute ProductRequestDTO dto
    ) {
        // 어드민이 특정 판매자 대신 등록하는 경우 sellerId를 dto에서 받음
        // TODO: AdminProductRequestDTO 별도 분리 고려
        Long adminId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(productService.register(adminId, dto));
    }
	
    // 상품 상세
    // GET /api/products/{productId}
    @GetMapping("/products/{productId}")
    public ResponseEntity<ProductDetailResponseDTO> getProduct(@PathVariable("productId") Long productId) {
    	log.info("상품 상세 조회 ID: " + productId);
    	return ResponseEntity.ok(productService.getProduct(productId));
    }
}
