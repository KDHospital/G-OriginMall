package com.example.gmall.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.gmall.dto.banner.BannerResponseDTO;
import com.example.gmall.service.BannerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BannerController {
	private final BannerService bannerService;
	
    // 웹 메인 - 활성 배너 목록
    // GET /api/banners
	@GetMapping("/banners")
	public ResponseEntity<List<BannerResponseDTO>> getActiveBanners(){
		return ResponseEntity.ok(bannerService.getActiveBanners());
	}
	
}
