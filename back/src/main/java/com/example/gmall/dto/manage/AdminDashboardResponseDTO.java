package com.example.gmall.dto.manage;

import lombok.Builder;
import lombok.Getter;
import java.util.List;
import java.util.Map;

@Getter
@Builder
public class AdminDashboardResponseDTO {
    private long todayOrders;
    private long todayRevenue;
    private long totalMembers;
    private long activeProducts;
    private long soldOutProducts;
    
    private List<DailySalesDTO> weeklySales;
    private Map<String, Long> orderStatusCount;
    
    private List<RecentOrderDTO> recentOrders;
    private List<RecentMemberDTO> recentMembers;
    
    // 판매자별 총 매출액
    private long totalRevenue;
    
    // 판매자별 실 매출액
    private long realRevenue;

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
    public static class RecentMemberDTO {
        private Long memberId;
        private String mname;
        private String loginId;
        private String createdAt;
    }
    
    @Getter
    @Builder
    public static class DailySalesDTO {
        private String date;
        private long revenue;
    }
}
