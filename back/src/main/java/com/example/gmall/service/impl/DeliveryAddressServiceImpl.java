package com.example.gmall.service.impl;

import com.example.gmall.domain.DeliveryAddress;
import com.example.gmall.domain.Member;
import com.example.gmall.dto.delivery.DeliveryAddressRequestDTO;
import com.example.gmall.dto.delivery.DeliveryAddressResponseDTO;
import com.example.gmall.repository.DeliveryAddressRepository;
import com.example.gmall.repository.MemberRepository;
import com.example.gmall.service.DeliveryAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

// ── JWT 적용 후 추가할 import ──────────────────────────────────────────────
// import com.example.gmall.security.CustomUserDetails;
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
// ──────────────────────────────────────────────────────────────────────────

@Service
@RequiredArgsConstructor
@Transactional
public class DeliveryAddressServiceImpl implements DeliveryAddressService {

    private final DeliveryAddressRepository deliveryAddressRepository;
    private final MemberRepository memberRepository;

    // 배송지 목록 조회
    @Transactional(readOnly = true)
    @Override
    public List<DeliveryAddressResponseDTO> getAddressList(Long memberId) {
        return deliveryAddressRepository.findByMemberId(memberId)
                .stream()
                .map(DeliveryAddressResponseDTO::new)
                .collect(Collectors.toList());
    }

    // 기본 배송지 조회
    @Transactional(readOnly = true)
    @Override
    public DeliveryAddressResponseDTO getDefaultAddress(Long memberId) {
        DeliveryAddress address = deliveryAddressRepository
                .findByMemberIdAndIsDefaultTrue(memberId)
                .orElse(null);
        return address != null ? new DeliveryAddressResponseDTO(address) : null;
    }

    // 배송지 추가 (최대 5개 제한)
    @Override
    public DeliveryAddressResponseDTO addAddress(Long memberId, DeliveryAddressRequestDTO dto) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 최대 5개 제한
        if (deliveryAddressRepository.countByMemberId(memberId) >= 5) {
            throw new IllegalStateException("배송지는 최대 5개까지 등록 가능합니다.");
        }

        // 첫 번째 배송지이면 자동으로 기본 배송지 설정
        boolean isDefault = deliveryAddressRepository.countByMemberId(memberId) == 0
                || dto.isDefault();

        // 기본 배송지로 설정 시 기존 기본 배송지 해제
        if (isDefault) {
            clearDefaultAddress(memberId);
        }

        DeliveryAddress address = DeliveryAddress.builder()
                .member(member)
                .recipientName(dto.getRecipientName())
                .recipientPhone(dto.getRecipientPhone())
                .zipcode(dto.getZipcode())
                .address(dto.getAddress())
                .addressDetail(dto.getAddressDetail())
                .isDefault(isDefault)
                .memo(dto.getMemo())
                .build();

        deliveryAddressRepository.save(address);
        return new DeliveryAddressResponseDTO(address);
    }

    // 배송지 수정
    @Override
    public DeliveryAddressResponseDTO updateAddress(Long memberId, Long addressId, DeliveryAddressRequestDTO dto) {
        DeliveryAddress address = getAddressOfMember(memberId, addressId);

        // 기본 배송지로 변경 요청 시 기존 기본 배송지 해제
        if (dto.isDefault() && !address.isDefault()) {
            clearDefaultAddress(memberId);
            address.updateIsDefault(true);
        }

        address.update(
                dto.getRecipientName(),
                dto.getRecipientPhone(),
                dto.getZipcode(),
                dto.getAddress(),
                dto.getAddressDetail(),
                dto.getMemo()
        );

        return new DeliveryAddressResponseDTO(address);
    }

    // 기본 배송지 변경
    @Override
    public void updateDefaultAddress(Long memberId, Long addressId) {
        // 기존 기본 배송지 해제
        clearDefaultAddress(memberId);

        // 새 기본 배송지 설정
        DeliveryAddress address = getAddressOfMember(memberId, addressId);
        address.updateIsDefault(true);
    }

    // 배송지 삭제
    @Override
    public void deleteAddress(Long memberId, Long addressId) {
        DeliveryAddress address = getAddressOfMember(memberId, addressId);

        // 기본 배송지 삭제 시 다른 배송지를 기본으로 자동 지정
        if (address.isDefault()) {
            deliveryAddressRepository.findByMemberId(memberId)
                    .stream()
                    .filter(a -> !a.getAddressId().equals(addressId))
                    .findFirst()
                    .ifPresent(a -> a.updateIsDefault(true));
        }

        deliveryAddressRepository.delete(address);
    }

    // 공통: 본인 소유 배송지인지 검증
    private DeliveryAddress getAddressOfMember(Long memberId, Long addressId) {
        DeliveryAddress address = deliveryAddressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 배송지입니다."));
        if (!address.getMember().getId().equals(memberId)) {
            throw new SecurityException("본인의 배송지만 수정할 수 있습니다.");
        }
        return address;
    }

    // 공통: 기존 기본 배송지 해제
    private void clearDefaultAddress(Long memberId) {
        deliveryAddressRepository.findByMemberIdAndIsDefaultTrue(memberId)
                .ifPresent(a -> a.updateIsDefault(false));
    }
}