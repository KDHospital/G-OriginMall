package com.example.gmall.service.impl;

import com.example.gmall.dto.manage.AdminDashboardResponseDTO;
import com.example.gmall.dto.manage.AdminDashboardResponseDTO.RecentMemberDTO;
import com.example.gmall.dto.manage.AdminDashboardResponseDTO.RecentOrderDTO;
import com.example.gmall.repository.MemberRepository;
import com.example.gmall.repository.OrdersRepository;
import com.example.gmall.repository.ProductRepository;
import com.example.gmall.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final OrdersRepository ordersRepository;
    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;

    @Override
    public AdminDashboardResponseDTO getDashboard() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusSeconds(1);

        // 오늘 주문 수
        long todayOrders = ordersRepository.countByCreatedAtBetween(startOfDay, endOfDay);

        // 오늘 매출
        long todayRevenue = ordersRepository.sumTotalPriceByCreatedAtBetween(startOfDay, endOfDay);

        // 전체 회원 수 (탈퇴 제외)
        long totalMembers = memberRepository.countByIsDeletedFalse();

        // 판매중 상품 수
        long activeProducts = productRepository.countBySoldStatus((byte) 0);

        // 품절 상품 수
        long soldOutProducts = productRepository.countBySoldStatus((byte) 2);

        // 최근 주문 5건
        List<RecentOrderDTO> recentOrders = ordersRepository
                .findAllWithFilters(null, null, null, null, null, PageRequest.of(0, 5))
                .getContent()
                .stream()
                .map(o -> RecentOrderDTO.builder()
                        .orderId(o.getOrderId())
                        .receiverName(o.getReceiverName())
                        .totalPrice(o.getTotalPrice())
                        .status(o.getStatus())
                        .statusLabel(switch (o.getStatus()) {
                            case 0 -> "결제전";
                            case 1 -> "상품준비중";
                            case 2 -> "배송중";
                            case 3 -> "배송완료";
                            case 4 -> "취소/환불";
                            default -> "알 수 없음";
                        })
                        .createdAt(o.getCreatedAt().toString().replace("T", " ").substring(0, 16))
                        .build())
                .collect(Collectors.toList());

        // 최근 가입 회원 5명
        List<RecentMemberDTO> recentMembers = memberRepository
                .findTop5ByIsDeletedFalseOrderByCreatedAtDesc()
                .stream()
                .map(m -> RecentMemberDTO.builder()
                        .memberId(m.getId())
                        .mname(m.getMname())
                        .loginId(m.getLoginId())
                        .createdAt(m.getCreatedAt().toString().replace("T", " ").substring(0, 16))
                        .build())
                .collect(Collectors.toList());

        return AdminDashboardResponseDTO.builder()
                .todayOrders(todayOrders)
                .todayRevenue(todayRevenue)
                .totalMembers(totalMembers)
                .activeProducts(activeProducts)
                .soldOutProducts(soldOutProducts)
                .recentOrders(recentOrders)
                .recentMembers(recentMembers)
                .build();
    }
}