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
import com.example.gmall.dto.product.ProductListResponseDTO;
import com.example.gmall.dto.product.ProductRequestDTO;
import com.example.gmall.dto.product.ProductResponseDTO;
import com.example.gmall.repository.CategoryRepository;
import com.example.gmall.repository.MemberRepository;
import com.example.gmall.repository.ProductImageRepository;
import com.example.gmall.repository.ProductRepository;
import com.example.gmall.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

	private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final MemberRepository memberRepository;
    private final ProductImageRepository productImageRepository;
    
    //웹-상품 목록 조회
	public Page<ProductListResponseDTO> getProducts(Integer categoryId, int page, int size){
		log.info("ProductServiceImpl 파일 내부의 getProducts 접근");
		Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC,"createdAt"));
		return productRepository.findActiveProducts(categoryId, pageable)
				.map(ProductListResponseDTO::new);
	}
	
	@Value("${file.upload.products}")
    private String uploadPath;

    // 상품 등록
	@Override
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
}
