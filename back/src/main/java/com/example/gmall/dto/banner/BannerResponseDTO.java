package com.example.gmall.dto.banner;

import com.example.gmall.domain.Banner;

import lombok.Getter;

@Getter
public class BannerResponseDTO {
	private Integer bannerId;
	private String imageUrl;
	private String linkUrl;
	private Integer sortOrder;
	private Boolean isActive;
	
	public BannerResponseDTO(Banner b) {
		this.bannerId = b.getBannerId();
		this.imageUrl = b.getImageUrl();
		this.linkUrl = b.getLinkUrl();
		this.sortOrder = b.getSortOrder();
		this.isActive = b.isActive();
	}
}
