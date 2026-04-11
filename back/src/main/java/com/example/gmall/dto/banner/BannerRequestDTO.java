package com.example.gmall.dto.banner;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BannerRequestDTO {
    private String imageUrl;   // S3 업로드 후 전달받은 URL
    private String linkUrl;
    private Integer sortOrder;
    private boolean isActive;
}
