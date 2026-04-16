package com.example.gmall.dto.order;

import com.example.gmall.domain.Orders;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class OrderResponseDTO {

    private Long orderId;
    private String orderGroupId;
    private Long memberId;
    private Long sellerId;
    private String sellerName;
    private Integer totalPrice;
    private Byte status;
    private String statusLabel;

    // 배송지 정보
    private String receiverName;
    private String receiverTel;
    private String zipcode;
    private String address;
    private String addressDetail;

    // 결제 정보
    private String paymentMethod;
    private LocalDateTime paidAt;

    private LocalDateTime createdAt;

    // 주문 상품 목록
    private List<OrderItemResponseDTO> orderItems;

    public OrderResponseDTO(Orders orders) {
        this.orderId = orders.getOrderId();
        this.orderGroupId = orders.getOrderGroupId();
        this.memberId = orders.getMember().getId();
        this.sellerId = orders.getSeller().getId();
        this.sellerName = orders.getSeller().getSettlementName() != null
                ? orders.getSeller().getSettlementName()
                : orders.getSeller().getMname();
        this.totalPrice = orders.getTotalPrice();
        this.status = orders.getStatus();
        this.statusLabel = switch (orders.getStatus()) {
            case 0 -> "결제전";
            case 1 -> "상품준비중";
            case 2 -> "배송중";
            case 3 -> "배송완료";
            case 4 -> "취소/환불";
            case 5 -> "결제실패";
            default -> "알 수 없음";
        };
        this.receiverName = orders.getReceiverName();
        this.receiverTel = orders.getReceiverTel();
        this.zipcode = orders.getZipcode();
        this.address = orders.getAddress();
        this.addressDetail = orders.getAddressDetail();
        this.paymentMethod = orders.getPaymentMethod();
        this.paidAt = orders.getPaidAt();
        this.createdAt = orders.getCreatedAt();
        this.orderItems = orders.getOrderItems()
                .stream()
                .map(OrderItemResponseDTO::new)
                .collect(Collectors.toList());
    }
}
