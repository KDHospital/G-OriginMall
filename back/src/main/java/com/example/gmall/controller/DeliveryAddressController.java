package com.example.gmall.controller;

import com.example.gmall.dto.delivery.DeliveryAddressRequestDTO;
import com.example.gmall.dto.delivery.DeliveryAddressResponseDTO;
import com.example.gmall.service.DeliveryAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ── JWT 적용 후 추가할 import ──────────────────────────────────────────────
// import com.example.gmall.security.CustomUserDetails;
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
// ──────────────────────────────────────────────────────────────────────────

@RestController
@RequestMapping("/api/members/addresses")
@RequiredArgsConstructor
public class DeliveryAddressController {

    private final DeliveryAddressService deliveryAddressService;

	 	// 배송지 목록 조회
	    @GetMapping
	    public ResponseEntity<List<DeliveryAddressResponseDTO>> getAddressList(
	            Authentication authentication) {
	        Long memberId = (Long) authentication.getPrincipal();
	        return ResponseEntity.ok(deliveryAddressService.getAddressList(memberId));
	    }
	
	    // 기본 배송지 조회
	    @GetMapping("/default")
	    public ResponseEntity<DeliveryAddressResponseDTO> getDefaultAddress(
	            Authentication authentication) {
	        Long memberId = (Long) authentication.getPrincipal();
	        DeliveryAddressResponseDTO dto = deliveryAddressService.getDefaultAddress(memberId);
	        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.noContent().build();
	    }
	
	    // 배송지 추가
	    @PostMapping
	    public ResponseEntity<DeliveryAddressResponseDTO> addAddress(
	            Authentication authentication,
	            @RequestBody DeliveryAddressRequestDTO dto) {
	        Long memberId = (Long) authentication.getPrincipal();
	        return ResponseEntity.ok(deliveryAddressService.addAddress(memberId, dto));
	    }
	
	    // 배송지 수정
	    @PutMapping("/{addressId}")
	    public ResponseEntity<DeliveryAddressResponseDTO> updateAddress(
	            Authentication authentication,
	            @PathVariable("addressId") Long addressId,
	            @RequestBody DeliveryAddressRequestDTO dto) {
	        Long memberId = (Long) authentication.getPrincipal();
	        return ResponseEntity.ok(deliveryAddressService.updateAddress(memberId, addressId, dto));
	    }
	
	    // 기본 배송지 변경
	    @PatchMapping("/{addressId}/default")
	    public ResponseEntity<Void> updateDefaultAddress(
	            Authentication authentication,
	            @PathVariable("addressId") Long addressId) {
	        Long memberId = (Long) authentication.getPrincipal();
	        deliveryAddressService.updateDefaultAddress(memberId, addressId);
	        return ResponseEntity.noContent().build();
	    }
	
	    // 배송지 삭제
	    @DeleteMapping("/{addressId}")
	    public ResponseEntity<Void> deleteAddress(
	            Authentication authentication,
	            @PathVariable("addressId") Long addressId) {
	        Long memberId = (Long) authentication.getPrincipal();
	        deliveryAddressService.deleteAddress(memberId, addressId);
	        return ResponseEntity.noContent().build();
	    }
}