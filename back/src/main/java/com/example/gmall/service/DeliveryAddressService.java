package com.example.gmall.service;

import java.util.List;

import com.example.gmall.dto.DeliveryAddressRequestDTO;
import com.example.gmall.dto.DeliveryAddressResponseDTO;

public interface DeliveryAddressService {
	
	// 배송지 목록 조회
    List<DeliveryAddressResponseDTO> getAddressList(Long memberId);

    // 기본 배송지 조회
    DeliveryAddressResponseDTO getDefaultAddress(Long memberId);

    // 배송지 추가
    DeliveryAddressResponseDTO addAddress(Long memberId, DeliveryAddressRequestDTO dto);

    // 배송지 수정
    DeliveryAddressResponseDTO updateAddress(Long memberId, Long addressId, DeliveryAddressRequestDTO dto);

    // 기본 배송지 변경
    void updateDefaultAddress(Long memberId, Long addressId);

    // 배송지 삭제
    void deleteAddress(Long memberId, Long addressId);
}


