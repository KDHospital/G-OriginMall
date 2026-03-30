package com.example.gmall.dto.order;

import com.example.gmall.domain.OrderItem;
import lombok.Getter;

@Getter
public class OrderItemResponseDTO {

    private Long orderItemId;
    private Long productId;
    private String productName;
    private Integer price;
    private int quantity;
    private Integer subtotal;

    public OrderItemResponseDTO(OrderItem orderItem) {
        this.orderItemId = orderItem.getOrderItemId();
        this.productId = orderItem.getProduct().getProductId();
        this.productName = orderItem.getProductName();
        this.price = orderItem.getPrice();
        this.quantity = orderItem.getQuantity();
        this.subtotal = orderItem.getSubtotal();
    }
}