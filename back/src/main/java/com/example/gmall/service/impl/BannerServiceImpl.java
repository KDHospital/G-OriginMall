package com.example.gmall.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.gmall.dto.banner.BannerResponseDTO;
import com.example.gmall.repository.BannerRepository;
import com.example.gmall.service.BannerService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) 
public class BannerServiceImpl implements BannerService {
	
	private final BannerRepository bannerRepository;
	
	//웹 메인, 배너 이미지 보여주기
	public List<BannerResponseDTO> getActiveBanners(){
		return bannerRepository.findByIsActiveTrueOrderBySortOrderAsc()
				.stream().map(BannerResponseDTO::new).collect(Collectors.toList());
	}

	
}
