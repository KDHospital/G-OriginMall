package com.example.gmall.service;

import java.util.List;

import com.example.gmall.dto.banner.BannerResponseDTO;

public interface BannerService {
	// 웹 메인 - 활성 배너만
	List<BannerResponseDTO> getActiveBanners();
	
	
}
