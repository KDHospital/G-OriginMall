package com.example.gmall.dto.order;

import com.example.gmall.domain.OrderStatusHistory;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class OrderStatusHistoryResponseDTO {
    private Long historyId;
    private Byte fromStatus;
    private Byte toStatus;
    private String toStatusLabel;
    private String memo;
    private LocalDateTime createdAt;

    public OrderStatusHistoryResponseDTO(OrderStatusHistory history) {
        this.historyId = history.getHistoryId();
        this.fromStatus = history.getFromStatus();
        this.toStatus = history.getToStatus();
        this.toStatusLabel = switch (history.getToStatus()) {
            case 0 -> "결제전";
            case 1 -> "상품준비중";
            case 2 -> "배송중";
            case 3 -> "배송완료";
            case 4 -> "취소/환불";
            case 5 -> "결제실패";
            default -> "알 수 없음";
        };
        this.memo = history.getMemo();
        this.createdAt = history.getCreatedAt();
    }
}
