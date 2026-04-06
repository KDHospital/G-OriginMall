package com.example.gmall.dto.product;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

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
    // 수정 시 유지할 기존 이미지 URL 목록
    private List<String> existingImageUrls;        
}
