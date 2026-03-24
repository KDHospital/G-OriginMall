package com.example.gmall.controller;

import com.example.gmall.dto.DeliveryAddressRequestDTO;
import com.example.gmall.dto.DeliveryAddressResponseDTO;
import com.example.gmall.service.DeliveryAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
            @RequestParam Long memberId
            // ── JWT 적용 후 교체 ──────────────────────────────────────────
            // @AuthenticationPrincipal CustomUserDetails userDetails
            // Long memberId = userDetails.getId();
            // ─────────────────────────────────────────────────────────────
    ) {
        return ResponseEntity.ok(deliveryAddressService.getAddressList(memberId));
    }

    // 기본 배송지 조회
    @GetMapping("/default")
    public ResponseEntity<DeliveryAddressResponseDTO> getDefaultAddress(
            @RequestParam Long memberId
            // ── JWT 적용 후 교체 ──────────────────────────────────────────
            // @AuthenticationPrincipal CustomUserDetails userDetails
            // Long memberId = userDetails.getId();
            // ─────────────────────────────────────────────────────────────
    ) {
        DeliveryAddressResponseDTO dto = deliveryAddressService.getDefaultAddress(memberId);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.noContent().build();
    }

    // 배송지 추가
    @PostMapping
    public ResponseEntity<DeliveryAddressResponseDTO> addAddress(
            @RequestParam Long memberId,
            // ── JWT 적용 후 교체 ──────────────────────────────────────────
            // @AuthenticationPrincipal CustomUserDetails userDetails
            // Long memberId = userDetails.getId();
            // ─────────────────────────────────────────────────────────────
            @RequestBody DeliveryAddressRequestDTO dto
    ) {
        return ResponseEntity.ok(deliveryAddressService.addAddress(memberId, dto));
    }

    // 배송지 수정
    @PutMapping("/{addressId}")
    public ResponseEntity<DeliveryAddressResponseDTO> updateAddress(
            @RequestParam Long memberId,
            // ── JWT 적용 후 교체 ──────────────────────────────────────────
            // @AuthenticationPrincipal CustomUserDetails userDetails
            // Long memberId = userDetails.getId();
            // ─────────────────────────────────────────────────────────────
            @PathVariable Long addressId,
            @RequestBody DeliveryAddressRequestDTO dto
    ) {
        return ResponseEntity.ok(deliveryAddressService.updateAddress(memberId, addressId, dto));
    }

    // 기본 배송지 변경
    @PatchMapping("/{addressId}/default")
    public ResponseEntity<Void> updateDefaultAddress(
            @RequestParam Long memberId,
            // ── JWT 적용 후 교체 ──────────────────────────────────────────
            // @AuthenticationPrincipal CustomUserDetails userDetails
            // Long memberId = userDetails.getId();
            // ─────────────────────────────────────────────────────────────
            @PathVariable Long addressId
    ) {
        deliveryAddressService.updateDefaultAddress(memberId, addressId);
        return ResponseEntity.noContent().build();
    }

    // 배송지 삭제
    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @RequestParam Long memberId,
            // ── JWT 적용 후 교체 ──────────────────────────────────────────
            // @AuthenticationPrincipal CustomUserDetails userDetails
            // Long memberId = userDetails.getId();
            // ─────────────────────────────────────────────────────────────
            @PathVariable Long addressId
    ) {
        deliveryAddressService.deleteAddress(memberId, addressId);
        return ResponseEntity.noContent().build();
    }
}