package com.example.gmall.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.gmall.dto.banner.BannerRequestDTO;
import com.example.gmall.dto.banner.BannerResponseDTO;
import com.example.gmall.dto.banner.BannerSortOrderDTO;

public interface BannerService {
	// 웹 메인 - 활성 배너만
	List<BannerResponseDTO> getActiveBanners();
	
	//어드민 - 전체 배너 목록 조회
	List<BannerResponseDTO> getBannerList();
	//어드민 - 배너 단건 조회
	BannerResponseDTO getBanner(Integer bannerId);
	//어드민 - 배너 등록 (최대 3개 제한)
	BannerResponseDTO createBanner(MultipartFile imageFile, BannerRequestDTO dto);
	//어드민 - 배너 수정
	BannerResponseDTO updateBanner(Integer bannerId, MultipartFile imageFile, BannerRequestDTO dto);
	//어드민 - 배너 삭제
	void deleteBanner(Integer bannerId);
	//어드민 - 노출 여부 토글 (is_active: 0 ↔ 1)
	BannerResponseDTO toggleActive(Integer bannerId);
	//어드민 - 드래그 앤 드롭으로 노출 순서 일괄 변경
	List<BannerResponseDTO> updateSortOrder(BannerSortOrderDTO dto);
	
}
