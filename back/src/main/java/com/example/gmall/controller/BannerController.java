package com.example.gmall.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.gmall.dto.banner.BannerRequestDTO;
import com.example.gmall.dto.banner.BannerResponseDTO;
import com.example.gmall.dto.banner.BannerSortOrderDTO;
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
	
    // 어드민 - 배너 목록 전체 조회
    //GET /api/admin/banners
    @GetMapping("/admin/banners")
    public ResponseEntity<List<BannerResponseDTO>> getBannerList() {
        return ResponseEntity.ok(bannerService.getBannerList());
    }

    // 어드민 - 배너 단건 조회 (수정 페이지 진입 시 사용)
    //GET /api/admin/banners/{bannerId}
    @GetMapping("/admin/banners/{bannerId}")
    public ResponseEntity<BannerResponseDTO> getBanner(@PathVariable("bannerId") Integer bannerId) {
        return ResponseEntity.ok(bannerService.getBanner(bannerId));
    }

    // 어드민 - 배너 등록 (multipart/form-data)
    //imageFile : 업로드할 이미지 파일
    //linkUrl   : 클릭 시 이동 URL
    //sortOrder : 노출 순서
    //isActive  : 노출 여부 (true/false)
    //POST /api/admin/banners
    @PostMapping(value = "/admin/banners", consumes = "multipart/form-data")
    public ResponseEntity<BannerResponseDTO> createBanner(
            @RequestPart("imageFile") MultipartFile imageFile,
            @RequestPart("data") BannerRequestDTO dto) {
        return ResponseEntity.ok(bannerService.createBanner(imageFile, dto));
    }

    // 어드민 - 배너 수정 (multipart/form-data)
    //imageFile : 새 이미지 파일 (없으면 기존 URL 유지)
    //PUT /api/admin/banners/{bannerId}
    @PutMapping(value = "/admin/banners/{bannerId}", consumes = "multipart/form-data")
    public ResponseEntity<BannerResponseDTO> updateBanner(
    		@PathVariable("bannerId") Integer bannerId,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestPart("data") BannerRequestDTO dto) {
        return ResponseEntity.ok(bannerService.updateBanner(bannerId, imageFile, dto));
    }

    // 어드민 - 배너 삭제
    //imageFile : 새 이미지 파일 (없으면 기존 URL 유지)
    //DELETE /api/admin/banners/{bannerId}
    @DeleteMapping("/admin/banners/{bannerId}")
    public ResponseEntity<Void> deleteBanner(@PathVariable("bannerId") Integer bannerId) {
        bannerService.deleteBanner(bannerId);
        return ResponseEntity.noContent().build();
    }

    // 어드민 - 노출 여부 토글
    //PATCH /api/admin/banners/{bannerId}/toggle
    @PatchMapping("/admin/banners/{bannerId}/toggle")
    public ResponseEntity<BannerResponseDTO> toggleActive(@PathVariable("bannerId") Integer bannerId) {
        return ResponseEntity.ok(bannerService.toggleActive(bannerId));
    }

    // 어드민 - 드래그 앤 드롭 순서 일괄 변경
    //body: { "bannerIds": [3, 1, 2] }
    //PATCH /api/admin/banners/sort-order
    @PatchMapping("/admin/banners/sort-order")
    public ResponseEntity<List<BannerResponseDTO>> updateSortOrder(@RequestBody BannerSortOrderDTO dto) {
        return ResponseEntity.ok(bannerService.updateSortOrder(dto));
    }	
}
