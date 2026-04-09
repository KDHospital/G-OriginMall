package com.example.gmall.dto.manage;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class SellerDashboardResponseDTO {
    private long todayOrders;
    private long todayRevenue;
    private long activeProducts;
    private long soldOutProducts;
    private long pendingOrders; // 미처리 주문 (결제전 + 상품준비중)

    private List<RecentOrderDTO> recentOrders;
    private List<RecentProductDTO> recentProducts;

    @Getter
    @Builder
    public static class RecentOrderDTO {
        private Long orderId;
        private String receiverName;
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
}