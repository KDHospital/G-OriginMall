package com.example.gmall.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.gmall.domain.Product;
import com.example.gmall.dto.category.CategoryResponseDTO;
import com.example.gmall.dto.product.ProductDetailResponseDTO;
import com.example.gmall.dto.product.ProductListResponseDTO;
import com.example.gmall.dto.product.ProductRequestDTO;
import com.example.gmall.dto.product.ProductResponseDTO;
import com.example.gmall.repository.ProductRepository;
import com.example.gmall.service.CategoryService;
import com.example.gmall.service.ProductService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api")
public class ProductController {

	private final ProductService productService;
	private final CategoryService categoryService;
	private final ProductRepository productRepository;
	
    // 웹-상품 전체/카테고리별 목록
    // GET /api/products?page=0&size=12&categoryId=1
    @GetMapping("/products")
    public ResponseEntity<Page<ProductListResponseDTO>> getProducts(
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "minPrice", defaultValue = "0") int minPrice,
            @RequestParam(value = "maxPrice", defaultValue = "200000") int maxPrice,
            @RequestParam(value = "sort",defaultValue = "latest") String sort,
            @RequestParam(value = "page",defaultValue = "0")  int page,
            @RequestParam(value = "size",defaultValue = "12") int size) {
        return ResponseEntity.ok(productService.getProducts(categoryId, minPrice, maxPrice, sort, page, size));
    }
    
    // 웹-상품 상세
    // GET /api/products/{productId}
    @GetMapping("/products/{productId}")
    public ResponseEntity<ProductDetailResponseDTO> getProduct(@PathVariable("productId") Long productId) {
    	log.info("상품 상세 조회 ID: " + productId);
    	return ResponseEntity.ok(productService.getProduct(productId));
    }
    
    // 웹-금빛나루 전용관
    // GET /api/products/certified?page=0&size=12&categoryId=1
    @GetMapping("/products/certified")
    public ResponseEntity<Page<ProductListResponseDTO>> getCertifiedProducts(
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "minPrice", defaultValue = "0") int minPrice,
            @RequestParam(value = "maxPrice", defaultValue = "200000") int maxPrice,
            @RequestParam(value = "sort",defaultValue = "latest") String sort,
            @RequestParam(value = "page",defaultValue = "0")  int page,
            @RequestParam(value = "size",defaultValue = "12") int size) {
        return ResponseEntity.ok(productService.getCertifiedProducts(categoryId, minPrice, maxPrice, sort, page, size));
    }
    
    // 웹-기획전 전용관
    // GET /api/products/exhibition?page=0&size=12&categoryId=1
    @GetMapping("/products/exhibition")
    public ResponseEntity<Page<ProductListResponseDTO>> getExhibitionProducts(
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            @RequestParam(value = "minPrice", defaultValue = "0") int minPrice,
            @RequestParam(value = "maxPrice", defaultValue = "200000") int maxPrice,
            @RequestParam(value = "sort",defaultValue = "latest") String sort,
            @RequestParam(value = "page",defaultValue = "0")  int page,
            @RequestParam(value = "size",defaultValue = "12") int size) {
        return ResponseEntity.ok(productService.getExhibitionProducts(categoryId, minPrice, maxPrice, sort, page, size));
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
    
	 // 판매자 본인 상품 목록
	 // GET /api/seller/products
	 @GetMapping("/seller/products")
	 public ResponseEntity<Page<ProductResponseDTO>> getSellerProducts(
	         @RequestParam(name = "page", defaultValue = "0") int page,
	         @RequestParam(name = "size", defaultValue = "10") int size,
	         Authentication authentication
	 ) {
	     Long sellerId = (Long) authentication.getPrincipal();
	     Pageable pageable = PageRequest.of(page, size);
	     Page<ProductResponseDTO> result = productService.getSellerProducts(sellerId, pageable);
	     return ResponseEntity.ok(result);
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
	

	 // 판매자 상품 수정
	 // PUT /api/seller/products/{productId}
	 @PutMapping(value = "/seller/products/{productId}",
	             consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	 public ResponseEntity<ProductResponseDTO> modify(
	         Authentication authentication,
	         @PathVariable("productId") Long productId,
	         @ModelAttribute ProductRequestDTO dto) {
	
	     Long sellerId = (Long) authentication.getPrincipal();
	
	     // 본인 상품인지 검증 (코드 추가 예정, GlobalExceptionHandler에 코드 추가 필요)
//	     verifyProductOwner(productId, sellerId);
	
	     return ResponseEntity.ok(productService.modify(productId, dto));
	 }
	
	 // 어드민 상품 수정 (판매자 구분 없이 모든 상품 수정 가능, 프론트에 코드 추가 예정)
	 // PUT /api/admin/products/{productId}
	 @PutMapping(value = "/admin/products/{productId}",
	             consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	 public ResponseEntity<ProductResponseDTO> modifyByAdmin(
			 @PathVariable("productId") Long productId,
	         @ModelAttribute ProductRequestDTO dto) {
	
	     return ResponseEntity.ok(productService.modify(productId, dto));
	 } 
    
	 //어드민 상품 목록
	// GET /api/admin/products?page=0&size=10
	 @GetMapping("/admin/products")
	 public ResponseEntity<Page<ProductListResponseDTO>> getAdminProducts(
	         @RequestParam(name = "page",defaultValue = "0")  int page,
	         @RequestParam(name = "size",defaultValue = "10") int size) {
	     Pageable pageable = PageRequest.of(page, size);
	     return ResponseEntity.ok(productService.getAdminProducts(pageable));
	 }

	// 어드민 상품 검색
	// GET /api/admin/products/search
	 @GetMapping("/admin/products/search")
	 public ResponseEntity<Page<ProductListResponseDTO>> searchAdminProducts(
	         @RequestParam(name = "keyword",required = false) String keyword,
	         @RequestParam(name = "categoryId",required = false) Integer categoryId,
	         @RequestParam(name = "sellerName",required = false) String sellerName,
	         @RequestParam(name = "soldStatus",required = false) Integer soldStatus,
	         @RequestParam(name = "certified",required = false) Boolean certified,
	         @RequestParam(name = "exhibition",required = false) Boolean exhibition,
	         @RequestParam(name = "page",defaultValue = "0")  int page,
	         @RequestParam(name = "size",defaultValue = "10") int size) {
		 log.info("검색 파라미터 체크: keyword={}, categoryId={}, soldStatus={}", keyword, categoryId, soldStatus);
		// 이 아래 서비스 호출 부분에서 (soldStatus != null ? soldStatus.byteValue() : null) 처럼 넘겨주면 됩니다.
		    return ResponseEntity.ok(productService.searchAdminProducts(
		            keyword, categoryId, sellerName, 
		            soldStatus != null ? soldStatus.byteValue() : null, 
		            certified, exhibition, page, size));
	 }

	// 어드민 선택 숨김처리
	// PATCH /api/admin/products/hide
	@PatchMapping("/admin/products/hide")
	public ResponseEntity<Void> hideProducts(@RequestBody List<Long> productIds) {
	    productIds.forEach(id -> {
	        Product p = productRepository.findById(id)
	                .orElseThrow(() -> new IllegalArgumentException("없는 상품: " + id));
	        p.updateSoldStatus((byte) 1); // HIDDEN
	    });
	    return ResponseEntity.ok().build();
	}

	// 어드민 선택 삭제 (HIDDEN 처리)
	// DELETE /api/admin/products
	@DeleteMapping("/admin/products")
	public ResponseEntity<Void> deleteProducts(@RequestBody List<Long> productIds) {
	    productIds.forEach(id -> {
	        Product p = productRepository.findById(id)
	                .orElseThrow(() -> new IllegalArgumentException("없는 상품: " + id));
	        p.updateSoldStatus((byte) 1); // 실제 삭제 대신 HIDDEN
	    });
	    return ResponseEntity.ok().build();
	}
	
}
