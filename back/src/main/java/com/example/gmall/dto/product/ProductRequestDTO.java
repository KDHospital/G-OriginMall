package com.example.gmall.dto.product;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequestDTO {

    private Integer categoryId;
    private String pname;
    private String pdesc;
    private Integer listPrice;
    private Integer discountPrice;
    private Integer price;
    private Integer stock;
    private Integer deliveryFee;
    private boolean isCertified;
    private boolean isExhibition;    
    // 썸네일 이미지 (Multipart)
    private List<MultipartFile> images;
    //품절
    private Byte soldStatus;
    // 수정 시 이미지 순서 인덱스
    private List<String> existingImageUrls;
    private List<Integer> existingImageOrders;        
    private List<Integer> newImageOrders;
    
    private String detailImageUrl;
    // 수정 시 새 상세 이미지 파일
    private MultipartFile detailImage;
}
