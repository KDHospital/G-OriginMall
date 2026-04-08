package com.example.gmall.dto.manage;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class AdminDashboardResponseDTO {
    private long todayOrders;
    private long todayRevenue;
    private long totalMembers;
    private long activeProducts;
    private long soldOutProducts;
    private List<RecentOrderDTO> recentOrders;
    private List<RecentMemberDTO> recentMembers;

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
    public static class RecentMemberDTO {
        private Long memberId;
        private String mname;
        private String loginId;
        private String createdAt;
    }
}
