package com.example.gmall.dto.manage;

import lombok.Builder;
import lombok.Getter;
import java.util.List;
import java.util.Map;

@Getter
@Builder
public class SellerDashboardResponseDTO {
    private long todayOrders;
    private long todayRevenue;
    private long activeProducts;
    private long soldOutProducts;
    private long pendingOrders; // 미처리 주문 (결제전 + 상품준비중)

    
    private List<DailySalesDTO> weeklySales;    // 최근 7일 매출 (라인 차트)
    private Map<String, Long> orderStatusCount; // 주문 상태 현황 (도넛 차트)

    private List<RecentOrderDTO> recentOrders;
    private List<RecentProductDTO> recentProducts;

    @Getter
    @Builder
    public static class RecentOrderDTO {
        private Long orderId;
        private String memberName;
        private Integer totalPrice;
        private Byte status;
        private String statusLabel;
        private String createdAt;
    }

    @Getter
    @Builder
    public static class RecentProductDTO {
        private Long productId;
        private String pname;
        private Integer price;
        private Integer stock;
        private Byte soldStatus;
        private String soldStatusLabel;
    }
    
    @Getter
    @Builder
    public static class DailySalesDTO {
        private String date;    // "04-15" 형식
        private long revenue;   // 매출액
    }
}