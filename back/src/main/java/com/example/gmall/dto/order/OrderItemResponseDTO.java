package com.example.gmall.dto.order;

import com.example.gmall.domain.OrderItem;
import lombok.Getter;

@Getter
public class OrderItemResponseDTO {

    private Long orderItemId;
    private Long productId;
    private String productName;
    private Integer price;
    private Integer quantity;
    private Integer subtotal;
    private Byte status;        // 0=정상, 1=취소
    private String statusLabel; // 정상, 취소
    private String thumbnailImageUrl;

    public OrderItemResponseDTO(OrderItem orderItem) {
        this.orderItemId = orderItem.getOrderItemId();
        this.productId = orderItem.getProduct().getProductId();
        this.productName = orderItem.getProductName();
        this.price = orderItem.getPrice();
        this.quantity = orderItem.getQuantity();
        this.subtotal = orderItem.getSubtotal();
        this.status = orderItem.getStatus();
        this.statusLabel = orderItem.isCancelled() ? "취소" : "정상";
        this.thumbnailImageUrl = orderItem.getProduct().getThumbnailImageUrl();
    }
}