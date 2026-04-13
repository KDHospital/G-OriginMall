package com.example.gmall.service.impl;

import com.example.gmall.domain.Banner;
import com.example.gmall.dto.banner.BannerRequestDTO;
import com.example.gmall.dto.banner.BannerResponseDTO;
import com.example.gmall.dto.banner.BannerSortOrderDTO;
import com.example.gmall.repository.BannerRepository;
import com.example.gmall.service.BannerService;
import com.example.gmall.service.LocalFileUploadService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) 
public class BannerServiceImpl implements BannerService {
	
	private static final int MAX_BANNER_COUNT = 3;
	private final BannerRepository bannerRepository;
	private final LocalFileUploadService fileUploadService;   // 로컬 파일 업로드
	
	//웹 메인, 배너 이미지 보여주기
	public List<BannerResponseDTO> getActiveBanners(){
		return bannerRepository.findByIsActiveTrueOrderBySortOrderAsc()
				.stream().map(BannerResponseDTO::new).collect(Collectors.toList());
	}
	
	//어드민 - 전체 배너 목록 조회
    public List<BannerResponseDTO> getBannerList() {
        return bannerRepository.findAllByOrderBySortOrderAsc()
                .stream()
                .map(BannerResponseDTO::new)
                .collect(Collectors.toList());
    }	
	//어드민 - 배너 단건 조회
    public BannerResponseDTO getBanner(Integer bannerId) {
        Banner banner = findBannerById(bannerId);
        return new BannerResponseDTO(banner);
    }
//어드민 - 배너 등록 (최대 3개 제한)
    @Transactional
    public BannerResponseDTO createBanner(MultipartFile imageFile, BannerRequestDTO dto) {
        long currentCount = bannerRepository.count();
        if (currentCount >= MAX_BANNER_COUNT) {
            throw new IllegalStateException("배너는 최대 " + MAX_BANNER_COUNT + "개까지만 등록 가능합니다.");
        }

        String imageUrl = fileUploadService.uploadBannerImage(imageFile);

        Banner banner = Banner.builder()
                .imageUrl(imageUrl)
                .linkUrl(dto.getLinkUrl())
                .sortOrder(dto.getSortOrder())
                .isActive(dto.isActive())
                .build();

        return new BannerResponseDTO(bannerRepository.save(banner));
    }
    
//어드민 - 배너 수정
    @Transactional
    public BannerResponseDTO updateBanner(Integer bannerId, MultipartFile imageFile, BannerRequestDTO dto) {
        Banner banner = findBannerById(bannerId);

        // 새 이미지 파일이 있으면 로컬 저장 후 URL 갱신
        if (imageFile != null && !imageFile.isEmpty()) {
            String newImageUrl = fileUploadService.uploadBannerImage(imageFile);
            banner.updateImageUrl(newImageUrl);
        } else if (dto.getImageUrl() != null) {
            banner.updateImageUrl(dto.getImageUrl());
        }
        banner.updateBanner(
        		dto.getImageUrl(),
        		dto.getLinkUrl(),
        		dto.getSortOrder(),
        		dto.isActive()
        		);

        return new BannerResponseDTO(bannerRepository.save(banner));
    }
//어드민 - 배너 삭제
    @Transactional
    public void deleteBanner(Integer bannerId) {
    	log.info("삭제 요청 ID: {}", bannerId);
        Banner banner = findBannerById(bannerId);
        log.info("삭제 대상 존재: {}", banner.getBannerId());
        bannerRepository.delete(banner);
    }
//어드민 - 노출 여부 토글 (is_active: 0 ↔ 1)
    @Transactional
    public BannerResponseDTO toggleActive(Integer bannerId) {
        Banner banner = findBannerById(bannerId);
        banner.updateActive(!banner.isActive());
        return new BannerResponseDTO(bannerRepository.save(banner));
    }
//어드민 - 드래그 앤 드롭으로 노출 순서 일괄 변경
    @Transactional
    public List<BannerResponseDTO> updateSortOrder(BannerSortOrderDTO dto) {
        List<Integer> bannerIds = dto.getBannerIds();

        IntStream.range(0, bannerIds.size()).forEach(i -> {
            Banner banner = findBannerById(bannerIds.get(i));
            banner.updateSortOrder(i+1);
            bannerRepository.save(banner);
        });

        return getBannerList();
    }

    // ── 내부 유틸 ──────────────────────────────────────────────
    private Banner findBannerById(Integer bannerId) {
        return bannerRepository.findById(bannerId)
                .orElseThrow(() -> new EntityNotFoundException("배너를 찾을 수 없습니다. id=" + bannerId));
    }
	

	
}
