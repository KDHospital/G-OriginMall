package com.example.gmall.service.impl;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.gmall.domain.Category;
import com.example.gmall.domain.Member;
import com.example.gmall.domain.Product;
import com.example.gmall.domain.ProductImage;
import com.example.gmall.dto.product.ProductDetailResponseDTO;
import com.example.gmall.dto.product.ProductListResponseDTO;
import com.example.gmall.dto.product.ProductRequestDTO;
import com.example.gmall.dto.product.ProductResponseDTO;
import com.example.gmall.repository.CategoryRepository;
import com.example.gmall.repository.MemberRepository;
import com.example.gmall.repository.ProductImageRepository;
import com.example.gmall.repository.ProductRepository;
import com.example.gmall.service.ProductService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

	private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final MemberRepository memberRepository;
    private final ProductImageRepository productImageRepository;
    
    //웹-상품 목록 조회
	public Page<ProductListResponseDTO> getProducts(Integer categoryId, int minPrice, int maxPrice, String sort, int page, int size){
	    // sort 값에 따라 정렬 기준 결정
	    Sort sorting = switch (sort) {
	        case "priceLow"  -> Sort.by(Sort.Direction.ASC,  "price");
	        case "priceHigh" -> Sort.by(Sort.Direction.DESC, "price");
	        default          -> Sort.by(Sort.Direction.DESC, "createdAt"); // latest
	    };

	    Pageable pageable = PageRequest.of(page, size, sorting);
	    return productRepository.findActiveProducts(categoryId, minPrice, maxPrice, pageable)
	            .map(ProductListResponseDTO::new);
	}
	//웹-상품 상세 조회
	@Override
	@Transactional(readOnly = true)
	public ProductDetailResponseDTO getProduct(Long productId) {
	    // 1. 데이터 가져오기
	    Product product = productRepository.findByProductIdWithCategory(productId)
	            .orElseThrow(() -> new EntityNotFoundException("해당 상품을 찾을 수 없습니다. ID: " + productId));
	    return new ProductDetailResponseDTO(product);
	}
	//웹-금빛나루 인증 목록 조회
    // GET /api/products/certified?page=0&size=12&categoryId=1
    // ──────────────────────────────────────────
    public Page<ProductListResponseDTO> getCertifiedProducts(Integer categoryId,int minPrice, int maxPrice, String sort, int page, int size) {
	    
    	Sort sorting = switch (sort) {
        case "priceLow"  -> Sort.by(Sort.Direction.ASC,  "price");
        case "priceHigh" -> Sort.by(Sort.Direction.DESC, "price");
        default          -> Sort.by(Sort.Direction.DESC, "createdAt"); // latest
    	};
    	
    	Pageable pageable = PageRequest.of(page, size, sorting);
        return productRepository.findCertifiedProducts(categoryId, minPrice, maxPrice, pageable)
                .map(ProductListResponseDTO::new);
    }
    
    //웹-기획전 목록 조회
    // GET /api/products/exhibition?page=0&size=12&categoryId=1
    // ──────────────────────────────────────────    
    public Page<ProductListResponseDTO> getExhibitionProducts(Integer categoryId,int minPrice, int maxPrice, String sort, int page, int size) {
    	Sort sorting = switch (sort) {
        case "priceLow"  -> Sort.by(Sort.Direction.ASC,  "price");
        case "priceHigh" -> Sort.by(Sort.Direction.DESC, "price");
        default          -> Sort.by(Sort.Direction.DESC, "createdAt"); // latest
    	};
    	
    	Pageable pageable = PageRequest.of(page, size, sorting);
        return productRepository.findExhibitionProducts(categoryId, minPrice, maxPrice, pageable)
                .map(ProductListResponseDTO::new);    	
    }
    
    //공통 유틸
    private Product findProductOrThrow(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품: " + productId));
    }
	
	@Value("${file.upload.products}")
    private String uploadPath;

    // 상품 등록
	@Override
	@Transactional
    public ProductResponseDTO register(Long sellerId, ProductRequestDTO dto) {
		
		
		Member seller = memberRepository.findById(sellerId)
	            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 판매자입니다."));

	    Category category = categoryRepository.findById(dto.getCategoryId())
	            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));

	    // 1. 이미지 없이 상품 먼저 저장 → productId 생성
	    Product product = Product.builder()
	            .seller(seller)
	            .category(category)
	            .pname(dto.getPname())
	            .pdesc(dto.getPdesc())
	            .listPrice(dto.getListPrice())
	            .discountPrice(dto.getDiscountPrice() != null ? dto.getDiscountPrice() : 0)
	            .price(dto.getPrice())
	            .stock(dto.getStock())
	            .deliveryFee(dto.getDeliveryFee() != null ? dto.getDeliveryFee() : 0)
	            .isCertified(dto.isCertified())
	            .isExhibition(dto.isExhibition())
	            .soldStatus((byte) 0)
	            .build();

	    productRepository.save(product); // ← productId 생성됨

	    // 2. productId 폴더에 이미지 업로드
	    if (dto.getImages() != null && !dto.getImages().isEmpty()) {
	        List<String> imageUrls = uploadImages(dto.getImages(), product.getProductId());

	        // 첫 번째 이미지 → 썸네일 업데이트
	        product.updateThumbnailImageUrl(imageUrls.get(0));

	        // 두 번째부터 → ProductImage 테이블 저장
	        for (int i = 1; i < imageUrls.size(); i++) {
	            ProductImage productImage = ProductImage.builder()
	                    .product(product)
	                    .imageUrl(imageUrls.get(i))
	                    .sortOrder(i)
	                    .build();
	            productImageRepository.save(productImage);
	        }
	    }

	    return new ProductResponseDTO(product);
	}

	// uploadImages() - sellerId → productId로 변경
	private List<String> uploadImages(List<MultipartFile> files, Long productId) {
	    String dirPath = uploadPath + productId + "/"; // ← productId로 변경
	    File dir = new File(dirPath);
	    if (!dir.exists()) dir.mkdirs();

	    return files.stream()
	            .filter(file -> file != null && !file.isEmpty())
	            .map(file -> {
	                try {
	                    String originalFilename = file.getOriginalFilename();
	                    String extension = originalFilename
	                            .substring(originalFilename.lastIndexOf("."));
	                    String savedFilename = UUID.randomUUID() + extension;
	                    file.transferTo(new File(dirPath + savedFilename));
	                    return "/uploads/products/" + productId + "/" + savedFilename;
	                } catch (IOException e) {
	                    log.error("이미지 업로드 실패: {}", e.getMessage());
	                    throw new RuntimeException("이미지 업로드에 실패했습니다.");
	                }
	            })
	            .toList();
	}
	
	// 판매자별 상품 목록 조회 (전체 상태 포함)
	@Override
	public Page<ProductResponseDTO> getSellerProducts(Long sellerId, Pageable pageable) {
	    return productRepository.findBySellerIdOrderByProductIdDesc(sellerId, pageable)
	            .map(ProductResponseDTO::new);
	}
	
	//상품 수정 (셀러, 어드민 공통)
	@Override
	@Transactional
	public ProductResponseDTO modify(Long productId, ProductRequestDTO dto) {

	    Product product = findProductOrThrow(productId);

	    // 카테고리 변경
	    Category category = categoryRepository.findById(dto.getCategoryId())
	            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));

	    // 기본 정보 수정 (Product 엔티티의 updateProduct 메서드 활용)
	    product.updateProduct(
	            dto.getPname(),
	            dto.getPdesc(),
	            category,
	            dto.getListPrice(),
	            dto.getDiscountPrice() != null ? dto.getDiscountPrice() : 0,
	            dto.getPrice(),
	            dto.getStock(),
	            dto.getDeliveryFee() != null ? dto.getDeliveryFee() : 0
	    );

	    // 판매 상태 변경
	    if (dto.getSoldStatus() != null) {
	        product.updateSoldStatus(dto.getSoldStatus());
	    }

	    // 금빛나루 인증 변경
	    product.updateIsCertified(dto.isCertified());

	    // 기획전 여부 변경 (어드민만 사용, 판매자는 항상 false)
	    product.updateIsExhibition(dto.isExhibition());

	    // ── 이미지 처리 ──────────────────────────────────────────────────
	    // 1. 기존 이미지 중 existingImageUrls에 없는 것 → 삭제
	    List<String> keepUrls = dto.getExistingImageUrls() != null
	            ? dto.getExistingImageUrls()
	            : new ArrayList<>();

	    // 썸네일이 keepUrls에 없으면 초기화
	    if (product.getThumbnailImageUrl() != null
	            && !keepUrls.contains(product.getThumbnailImageUrl())) {
	        deleteFile(product.getThumbnailImageUrl());
	        
	        // keepUrls에 남은 이미지가 있으면 첫 번째를 썸네일로 승격
	        if (!keepUrls.isEmpty()) {
	            product.updateThumbnailImageUrl(keepUrls.get(0));
	        } else {
	            product.updateThumbnailImageUrl(null);
	        }
	    }

	    // product_image 테이블에서 keepUrls에 없는 것 삭제
	    List<ProductImage> toDelete = product.getProductImages().stream()
	            .filter(img -> !keepUrls.contains(img.getImageUrl()))
	            .collect(Collectors.toList());

	    List<Integer> toDeleteIds = toDelete.stream()
	            .map(ProductImage::getProductImageId)
	            .collect(Collectors.toList());
	    
	    toDelete.forEach(img -> deleteFile(img.getImageUrl()));
	    
	    
	    log.info("keepUrls: {}", keepUrls);
	    log.info("product images: {}", product.getProductImages().stream()
	        .map(ProductImage::getImageUrl)
	        .collect(Collectors.toList()));
	    
	    toDelete.forEach(img -> deleteFile(img.getImageUrl()));
	    productImageRepository.deleteAllInBatch(toDelete);

	    // 2. 새 이미지 업로드
	    if (dto.getImages() != null && !dto.getImages().isEmpty()) {
	        List<String> newUrls = uploadImages(dto.getImages(), productId);

	        // 썸네일이 비어있으면 첫 번째 새 이미지를 썸네일로
	        if (product.getThumbnailImageUrl() == null) {
	            product.updateThumbnailImageUrl(newUrls.get(0));
	            // 두 번째부터 product_image에 저장
	            for (int i = 1; i < newUrls.size(); i++) {
	                saveProductImage(product, newUrls.get(i),
	                        product.getProductImages().size() + i);
	            }
	        } else {
	            // 썸네일 있으면 전부 product_image에 추가
	            for (int i = 0; i < newUrls.size(); i++) {
	                saveProductImage(product, newUrls.get(i),
	                        product.getProductImages().size() + i + 1);
	            }
	        }
	    }
	    

	    return new ProductResponseDTO(product);
	}
	


	// ── 공통 유틸 메서드 ────────────────────────────────────────────────
	private void saveProductImage(Product product, String imageUrl, int sortOrder) {
	    ProductImage productImage = ProductImage.builder()
	            .product(product)
	            .imageUrl(imageUrl)
	            .sortOrder(sortOrder)
	            .build();
	    productImageRepository.save(productImage);
	}
	
	// -- 판매자 상품 수정 이미지 삭제
	private void deleteFile(String imageUrl) {
	    if (imageUrl == null) return;
	    try {
	        // uploadPath + productId 폴더에 저장되어 있으므로
	        // imageUrl: /uploads/products/1/xxx.jpg
	        // 실제 경로: {uploadPath의 상위}/uploads/products/1/xxx.jpg
	        String relativePath = imageUrl.startsWith("/")
	                ? imageUrl.substring(1)
	                : imageUrl;
	        
	        // 프로젝트 루트 기준 절대 경로로 변환
	        String absolutePath = System.getProperty("user.dir") + "/" + relativePath;
	        
	        java.nio.file.Path path = java.nio.file.Paths.get(absolutePath);
	        boolean deleted = java.nio.file.Files.deleteIfExists(path);
	        log.info("파일 삭제 {}: {}", deleted ? "성공" : "파일없음", absolutePath);
	    } catch (IOException e) {
	        log.warn("파일 삭제 실패: {}", imageUrl);
	    }
	}
	
//	재고처리
	@Transactional
	public void decreaseStock(Long productId, int quantity) {
	    Product product = productRepository.findById(productId)
	            .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

	    // 1. 재고 차감
	    int remainStock = product.getStock() - quantity;
	    if (remainStock < 0) throw new RuntimeException("재고가 부족합니다.");
	    
	    product.setStock(remainStock);

	    // 2. 재고가 0이면 품절(2) 및 숨김(1) 등 비즈니스 로직 적용
	    if (remainStock == 0) {
	        product.setSoldStatus((byte) 2); // 2: SOLD_OUT (품절)
	    }
	}
	
	//어드민- 상품 목록 조회
	@Override
	public Page<ProductListResponseDTO> getAdminProducts(Pageable pageable) {
	    return productRepository.findAllByOrderByProductIdDesc(pageable)
	            .map(ProductListResponseDTO::new);
	}
	//어드민- 상품 목록 조회,검색
	@Override
	public Page<ProductListResponseDTO> searchAdminProducts(
	        String keyword, Integer categoryId, String sellerName,
	        Byte soldStatus, Boolean certified, Boolean exhibition,
	        int page, int size) {

	    Pageable pageable = PageRequest.of(page, size,
	            Sort.by(Sort.Direction.DESC, "productId"));

	    return productRepository.searchAdminProducts(
	            (keyword    != null && !keyword.isBlank())    ? keyword    : null,
	            categoryId,
	            (sellerName != null && !sellerName.isBlank()) ? sellerName : null,
	            soldStatus,
	            certified,
	            exhibition,
	            pageable
	    ).map(ProductListResponseDTO::new);
	}
}
