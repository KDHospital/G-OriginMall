package com.example.gmall.dto.product;

import lombok.Getter;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

@Getter
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
}
