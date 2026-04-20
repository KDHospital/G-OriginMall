package com.example.gmall.service.impl;

import com.example.gmall.dto.manage.SellerDashboardResponseDTO;
import com.example.gmall.dto.manage.SellerDashboardResponseDTO.RecentOrderDTO;
import com.example.gmall.dto.manage.SellerDashboardResponseDTO.RecentProductDTO;
import com.example.gmall.repository.MemberRepository;
import com.example.gmall.repository.OrdersRepository;
import com.example.gmall.repository.ProductRepository;
import com.example.gmall.service.SellerDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SellerDashboardServiceImpl implements SellerDashboardService {

    private final OrdersRepository ordersRepository;
    private final ProductRepository productRepository;

    @Override
    public SellerDashboardResponseDTO getDashboard(Long sellerId) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusSeconds(1);

        // 오늘 주문 수
        long todayOrders = ordersRepository
                .countBySellerIdAndCreatedAtBetween(sellerId, startOfDay, endOfDay);

        // 오늘 매출
        long todayRevenue = ordersRepository
                .sumTotalPriceBySellerIdAndCreatedAtBetween(sellerId, startOfDay, endOfDay);

        // 판매 중 상품 수
        long activeProducts = productRepository.countBySellerIdAndSoldStatus(sellerId, (byte) 0);

        // 품절 상품 수
        long soldOutProducts = productRepository.countBySellerIdAndSoldStatus(sellerId, (byte) 2);

        // 미처리 주문 (결제전 + 상품준비중)
        long pendingOrders = ordersRepository.countBySellerIdAndStatus(sellerId, (byte) 0)
                           + ordersRepository.countBySellerIdAndStatus(sellerId, (byte) 1);

        // 최근 주문 5건
        List<RecentOrderDTO> recentOrders = ordersRepository
                .findBySellerIdOrderByCreatedAtDescOrderIdDesc(sellerId, PageRequest.of(0, 5))
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
                            case 5 -> "결제실패";
                            default -> "알 수 없음";
                        })
                        .createdAt(o.getCreatedAt().toString().replace("T", " ").substring(0, 16))
                        .build())
                .collect(Collectors.toList());

        // 내 상품 현황 5개
        List<RecentProductDTO> recentProducts = productRepository
                .findBySellerIdOrderByProductIdDesc(sellerId, PageRequest.of(0, 5))
                .getContent()
                .stream()
                .map(p -> RecentProductDTO.builder()
                        .productId(p.getProductId())
                        .pname(p.getPname())
                        .price(p.getPrice())
                        .stock(p.getStock())
                        .soldStatus(p.getSoldStatus())
                        .soldStatusLabel(switch (p.getSoldStatus()) {
                            case 0 -> "판매중";
                            case 1 -> "숨김";
                            case 2 -> "품절";
                            case 3 -> "삭제됨";
                            default -> "알 수 없음";
                        })
                        .build())
                .collect(Collectors.toList());

        return SellerDashboardResponseDTO.builder()
                .todayOrders(todayOrders)
                .todayRevenue(todayRevenue)
                .activeProducts(activeProducts)
                .soldOutProducts(soldOutProducts)
                .pendingOrders(pendingOrders)
                .recentOrders(recentOrders)
                .recentProducts(recentProducts)
                .build();
    }
}