package com.example.gmall.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.gmall.domain.Member;
import com.example.gmall.domain.OrderItem;
import com.example.gmall.domain.OrderStatusHistory;
import com.example.gmall.domain.Orders;
import com.example.gmall.domain.Product;
import com.example.gmall.dto.order.OrderRequestDTO;
import com.example.gmall.dto.order.OrderResponseDTO;
import com.example.gmall.repository.MemberRepository;
import com.example.gmall.repository.OrderItemRepository;
import com.example.gmall.repository.OrderStatusHistoryRepository;
import com.example.gmall.repository.OrdersRepository;
import com.example.gmall.repository.ProductRepository;
import com.example.gmall.service.OrderService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;



@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {
	
	private final OrdersRepository ordersRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;

    // 주문 생성
    @Override
    public OrderResponseDTO createOrder(Long memberId, OrderRequestDTO dto) {

        // 회원 조회
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 첫 번째 상품으로 판매자 조회
        // 장바구니/바로구매 모두 동일 판매자 상품만 한 주문으로 묶임
        Product firstProduct = productRepository.findById(
                dto.getOrderItems().get(0).getProductId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));
        Member seller = firstProduct.getSeller();

        // 총 금액 계산
        int totalPrice = 0;

        // 주문 생성
        Orders orders = Orders.builder()
                .member(member)
                .seller(seller)
                .totalPrice(0) // 나중에 업데이트
                .receiverName(dto.getReceiverName())
                .receiverTel(dto.getReceiverTel())
                .zipcode(dto.getZipcode())
                .address(dto.getAddress())
                .addressDetail(dto.getAddressDetail())
                .paymentMethod(dto.getPaymentMethod())
                .build();

        ordersRepository.save(orders);

        // 주문 상품 저장 (스냅샷)
        for (OrderRequestDTO.OrderItemRequestDTO itemDto : dto.getOrderItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));

            // 재고 확인
            if (product.getStock() < itemDto.getQuantity()) {
                throw new IllegalStateException(
                    product.getPname() + "의 재고가 부족합니다. (현재 재고: " + product.getStock() + ")");
            }

            // 재고 차감
            product.decreaseStock(itemDto.getQuantity());

            // 주문 상품 스냅샷 저장
            int subtotal = product.getPrice() * itemDto.getQuantity();
            totalPrice += subtotal;

            OrderItem orderItem = OrderItem.builder()
                    .orders(orders)
                    .product(product)
                    .productName(product.getPname())   // 스냅샷
                    .price(product.getPrice())          // 스냅샷
                    .quantity(itemDto.getQuantity())
                    .subtotal(subtotal)
                    .build();

            orderItemRepository.save(orderItem);
        }

        // 배송비 합산 (판매자별 1회)
        int deliveryFee = firstProduct.getDeliveryFee();
        totalPrice += deliveryFee;

        // 총 금액 업데이트
        orders.updateStatus((byte) 0); // 결제전 상태

        // totalPrice 업데이트를 위한 메서드 필요 
        orders.updateTotalPrice(totalPrice);

        // 주문 상태 이력 저장
        OrderStatusHistory history = OrderStatusHistory.builder()
                .orders(orders)
                .seller(seller)
                .fromStatus((byte) -1) // 최초 생성
                .toStatus((byte) 0)    // 결제전
                .memo("주문 생성")
                .build();

        orderStatusHistoryRepository.save(history);

        log.info("주문 생성 완료 - orderId: {}, memberId: {}, totalPrice: {}",
                orders.getOrderId(), memberId, totalPrice);

        return new OrderResponseDTO(orders);
    }

    // 주문 목록 조회
    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getOrders(Long memberId) {
        return ordersRepository.findByMemberIdOrderByCreatedAtDesc(memberId)
                .stream()
                .map(OrderResponseDTO::new)
                .collect(Collectors.toList());
    }

    // 주문 상세 조회
    @Override
    @Transactional(readOnly = true)
    public OrderResponseDTO getOrder(Long memberId, Long orderId) {
        Orders orders = getOrderOfMember(memberId, orderId);
        return new OrderResponseDTO(orders);
    }

    // 주문 취소
    @Override
    public void cancelOrder(Long memberId, Long orderId) {
        Orders orders = getOrderOfMember(memberId, orderId);

        // 배송중, 배송완료는 취소 불가
        if (orders.getStatus() >= 2) {
            throw new IllegalStateException("배송 중이거나 완료된 주문은 취소할 수 없습니다.");
        }

        // 재고 복구
        orders.getOrderItems().forEach(item ->
            item.getProduct().restoreStock(item.getQuantity())
        );

        // 주문 상태 이력 저장
        OrderStatusHistory history = OrderStatusHistory.builder()
                .orders(orders)
                .seller(orders.getSeller())
                .fromStatus(orders.getStatus())
                .toStatus((byte) 4) // 취소/환불
                .memo("주문 취소")
                .build();

        orderStatusHistoryRepository.save(history);

        // 주문 상태 변경
        orders.updateStatus((byte) 4);
    }

    // 공통: 본인 주문인지 검증
    private Orders getOrderOfMember(Long memberId, Long orderId) {
        Orders orders = ordersRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주문입니다."));
        if (!orders.getMember().getId().equals(memberId)) {
            throw new SecurityException("본인의 주문만 조회할 수 있습니다.");
        }
        return orders;
    }
	
}
