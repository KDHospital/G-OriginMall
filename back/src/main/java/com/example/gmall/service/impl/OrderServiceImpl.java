package com.example.gmall.service.impl;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.gmall.domain.Member;
import com.example.gmall.domain.OrderItem;
import com.example.gmall.domain.OrderStatusHistory;
import com.example.gmall.domain.Orders;
import com.example.gmall.domain.Product;
import com.example.gmall.dto.order.OrderRequestDTO;
import com.example.gmall.dto.order.OrderResponseDTO;
import com.example.gmall.dto.order.OrderStatusHistoryResponseDTO;
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
    
    @Value("${toss.secret-key}")
    private String tossSecretKey;

    // 주문 생성 (판매자별 분리)
    @Override
    public List<OrderResponseDTO> createOrder(Long memberId, OrderRequestDTO dto) {

        // 회원 조회
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 묶음 주문 식별자 생성 (같은 장바구니에서 나온 주문 묶음)
        String orderGroupId = UUID.randomUUID().toString();

        // 판매자별로 상품 그룹핑
        Map<Long, List<OrderRequestDTO.OrderItemRequestDTO>> groupBySeller =
            new LinkedHashMap<>();

        for (OrderRequestDTO.OrderItemRequestDTO itemDto : dto.getOrderItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));

            // 재고 확인
            if (product.getStock() < itemDto.getQuantity()) {
                throw new IllegalStateException(
                    product.getPname() + "의 재고가 부족합니다. (현재 재고: " + product.getStock() + ")");
            }

            Long sellerId = product.getSeller().getId();
            groupBySeller.computeIfAbsent(sellerId, k -> new ArrayList<>()).add(itemDto);
        }

        // 판매자별 주문 생성
        List<OrderResponseDTO> result = new ArrayList<>();

        for (Map.Entry<Long, List<OrderRequestDTO.OrderItemRequestDTO>> entry : groupBySeller.entrySet()) {
            Long sellerId = entry.getKey();
            List<OrderRequestDTO.OrderItemRequestDTO> sellerItems = entry.getValue();

            // 판매자 조회
            Member seller = memberRepository.findById(sellerId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 판매자입니다."));

            // 주문 생성 (totalPrice는 나중에 업데이트)
            Orders orders = Orders.builder()
                    .member(member)
                    .seller(seller)
                    .orderGroupId(orderGroupId)
                    .totalPrice(0)
                    .receiverName(dto.getReceiverName())
                    .receiverTel(dto.getReceiverTel())
                    .zipcode(dto.getZipcode())
                    .address(dto.getAddress())
                    .addressDetail(dto.getAddressDetail())
                    .paymentMethod(dto.getPaymentMethod())
                    .build();

            ordersRepository.save(orders);

            // 주문 상품 저장 및 총 금액 계산
            int totalPrice = 0;

            for (OrderRequestDTO.OrderItemRequestDTO itemDto : sellerItems) {
                Product product = productRepository.findById(itemDto.getProductId())
                        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));

                // 재고 차감
                product.decreaseStock(itemDto.getQuantity());

                // 스냅샷 저장
                int subtotal = product.getPrice() * itemDto.getQuantity();
                totalPrice += subtotal;

                OrderItem orderItem = OrderItem.builder()
                        .orders(orders)
                        .product(product)
                        .productName(product.getPname())
                        .price(product.getPrice())
                        .quantity(itemDto.getQuantity())
                        .subtotal(subtotal)
                        .build();

                orderItemRepository.save(orderItem);
            }

            // 배송비 합산 (판매자당 1회)
            Product firstProduct = productRepository.findById(
                    sellerItems.get(0).getProductId()).orElseThrow();
            totalPrice += firstProduct.getDeliveryFee();

            // 총 금액 업데이트
            orders.updateTotalPrice(totalPrice);

            // 주문 상태 이력 저장
            OrderStatusHistory history = OrderStatusHistory.builder()
                    .orders(orders)
                    .seller(seller)
                    .fromStatus((byte) -1)
                    .toStatus((byte) 0)
                    .memo("주문 생성")
                    .build();

            orderStatusHistoryRepository.save(history);

            log.info("주문 생성 완료 - orderId: {}, sellerId: {}, totalPrice: {}",
                    orders.getOrderId(), sellerId, totalPrice);

            result.add(new OrderResponseDTO(orders));
        }

        return result;
    }

    // 주문 목록 조회
    @Override
    public Page<OrderResponseDTO> getOrders(Long memberId, Pageable pageable) {
        return ordersRepository.findByMemberIdOrderByCreatedAtDesc(memberId, pageable)
                .map(OrderResponseDTO::new);
    }

    // 주문 상세 조회
    @Override
    @Transactional(readOnly = true)
    public OrderResponseDTO getOrder(Long memberId, Long orderId) {
        Orders orders = getOrderOfMember(memberId, orderId);
        return new OrderResponseDTO(orders);
    }

    // 주문 전체 취소
    @Override
    public void cancelOrder(Long memberId, Long orderId) {
        Orders orders = getOrderOfMember(memberId, orderId);

        // 배송중, 배송완료는 취소 불가
        if (orders.getStatus() >= 2) {
            throw new IllegalStateException("배송 중이거나 완료된 주문은 취소할 수 없습니다.");
        }

        // 정상 상태인 OrderItem만 재고 복구
        orders.getOrderItems().stream()
                .filter(item -> !item.isCancelled())
                .forEach(item -> {
                    item.getProduct().restoreStock(item.getQuantity());
                    item.cancel();
                });

        // 주문 상태 이력 저장
        OrderStatusHistory history = OrderStatusHistory.builder()
                .orders(orders)
                .seller(orders.getSeller())
                .fromStatus(orders.getStatus())
                .toStatus((byte) 4)
                .memo("주문 전체 취소")
                .build();

        orderStatusHistoryRepository.save(history);

        // 주문 상태 변경
        orders.updateStatus((byte) 4);

        log.info("주문 전체 취소 완료 - orderId: {}", orderId);
    }

    // 주문 상품 개별 취소
    @Override
    public void cancelOrderItem(Long memberId, Long orderId, Long orderItemId) {
        Orders orders = getOrderOfMember(memberId, orderId);

        // 배송중, 배송완료는 취소 불가
        if (orders.getStatus() >= 2) {
            throw new IllegalStateException("배송 중이거나 완료된 주문은 취소할 수 없습니다.");
        }

        // 해당 OrderItem 조회
        OrderItem orderItem = orders.getOrderItems().stream()
                .filter(item -> item.getOrderItemId().equals(orderItemId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주문 상품입니다."));

        // 이미 취소된 상품인지 확인
        if (orderItem.isCancelled()) {
            throw new IllegalStateException("이미 취소된 상품입니다.");
        }

        // 재고 복구 및 취소 처리
        orderItem.getProduct().restoreStock(orderItem.getQuantity());
        orderItem.cancel();

        // 총 금액 업데이트 (취소된 상품 금액 차감)
        orders.updateTotalPrice(orders.getTotalPrice() - orderItem.getSubtotal());

        // 모든 상품이 취소됐으면 주문 전체 취소 처리
        boolean allCancelled = orders.getOrderItems().stream()
                .allMatch(OrderItem::isCancelled);
        if (allCancelled) {
            orders.updateStatus((byte) 4);
        }

        // 주문 상태 이력 저장
        OrderStatusHistory history = OrderStatusHistory.builder()
                .orders(orders)
                .seller(orders.getSeller())
                .fromStatus(orders.getStatus())
                .toStatus(allCancelled ? (byte) 4 : orders.getStatus())
                .memo("상품 개별 취소: " + orderItem.getProductName())
                .build();

        orderStatusHistoryRepository.save(history);

        log.info("주문 상품 개별 취소 완료 - orderId: {}, orderItemId: {}, productName: {}",
                orderId, orderItemId, orderItem.getProductName());
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
    
    // 토스페이먼츠 API 연동
    @Override
    public void confirmPayment(Long memberId, Long orderId, String tossOrderId, String paymentKey, Long amount) {
        Orders orders = getOrderOfMember(memberId, orderId);

        // 금액 위변조 검증 — 토스에서 받은 amount와 실제 주문 금액 비교
        if (orders.getTotalPrice().longValue()  != amount) {
            throw new IllegalStateException("결제 금액이 주문 금액과 일치하지 않습니다.");
        }

        // 토스 최종 승인 API 호출
        try {
            String authorizations = Base64.getEncoder()
                .encodeToString((tossSecretKey + ":").getBytes(StandardCharsets.UTF_8));

            HttpClient client = HttpClient.newHttpClient();

            String requestBody = String.format(
        	    "{\"paymentKey\":\"%s\",\"orderId\":\"%s\",\"amount\":%d}",
        	    paymentKey, tossOrderId, amount   // ← tossOrderId = "ORDER_10" 형태
        	);

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.tosspayments.com/v1/payments/confirm"))
                .header("Authorization", "Basic " + authorizations)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.error("토스 승인 실패 응답: {}", response.body());
                throw new IllegalStateException("결제 승인에 실패했습니다.");
            }
            
            // 승인 성공 후 tossOrderId 저장
            orders.updateTossOrderId(tossOrderId);

        } catch (IOException | InterruptedException e) {
            log.error("토스 승인 API 호출 오류", e);
            throw new IllegalStateException("결제 승인 중 오류가 발생했습니다.");
        }

        // 결제 정보 업데이트
        orders.updatePayment(paymentKey, "CARD", LocalDateTime.now());

        // 주문 상태 변경: 0(결제대기) → 1(결제완료)
        OrderStatusHistory history = OrderStatusHistory.builder()
            .orders(orders)
            .seller(orders.getSeller())
            .fromStatus(orders.getStatus())
            .toStatus((byte) 1)
            .memo("토스페이먼츠 결제 승인 완료")
            .build();

        orderStatusHistoryRepository.save(history);
        orders.updateStatus((byte) 1);

        log.info("결제 승인 완료 - orderId: {}, paymentKey: {}", orderId, paymentKey);
    }
    
    // 주문(결제) 이력
    @Override
    public List<OrderStatusHistoryResponseDTO> getOrderHistory(Long memberId, Long orderId) {
        // 본인 주문인지 검증
        getOrderOfMember(memberId, orderId);

        return orderStatusHistoryRepository
                .findByOrdersOrderIdOrderByCreatedAtDesc(orderId)
                .stream()
                .map(OrderStatusHistoryResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    @Override
    public Map<String, Long> getSellerOrderCount(Long sellerId) {
        Map<String, Long> count = new HashMap<>();
        count.put("total", ordersRepository.countBySellerId(sellerId));
        count.put("status0", ordersRepository.countBySellerIdAndStatus(sellerId, (byte) 0));
        count.put("status1", ordersRepository.countBySellerIdAndStatus(sellerId, (byte) 1));
        count.put("status2", ordersRepository.countBySellerIdAndStatus(sellerId, (byte) 2));
        count.put("status3", ordersRepository.countBySellerIdAndStatus(sellerId, (byte) 3));
        count.put("status4", ordersRepository.countBySellerIdAndStatus(sellerId, (byte) 4));
        return count;
    }

    @Override
    public void updateOrderStatus(Long sellerId, Long orderId, Byte newStatus) {
        Orders orders = ordersRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주문입니다."));

        // 본인 상점 주문인지 검증
        if (!orders.getSeller().getId().equals(sellerId)) {
            throw new IllegalStateException("접근 권한이 없습니다.");
        }

        
        // [추가] 배송 시작(2)으로 변경될 때 재고 및 품절 상태 체크
        if (newStatus == 2) {
            orders.getOrderItems().forEach(item -> {
                Product product = item.getProduct();
                
                // 1. 이미 결제 시점에 재고는 차감 (createOrder 참고)
                // 2. 현재 재고가 0이라면 상품의 soldStatus를 2(품절)로 변경
                if (product.getStock() <= 0) {
                    // Product 엔티티에 setSoldStatus가 있다고 가정
                    product.setSoldStatus((byte) 2); 
                    log.info("상품 품절 처리 완료 - productId: {}, pname: {}", product.getProductId(), product.getPname());
                }
            });
        }
        
        // 취소(4)는 cancelOrder() 사용
        if (newStatus == 4) {
            throw new IllegalStateException("취소는 취소 API를 사용해주세요.");
        }

        // 배송완료(3) 이후는 변경 불가
        if (orders.getStatus() >= 3) {
            throw new IllegalStateException("배송완료된 주문은 상태를 변경할 수 없습니다.");
        }

        // 한 단계씩만 앞으로
        if (newStatus != orders.getStatus() + 1) {
            throw new IllegalStateException("순서에 맞게 상태를 변경해주세요.");
        }

        // 상태 이력 저장
        OrderStatusHistory history = OrderStatusHistory.builder()
                .orders(orders)
                .seller(orders.getSeller())
                .fromStatus(orders.getStatus())
                .toStatus(newStatus)
                .memo(switch (newStatus) {
                    case 2 -> "배송 시작";
                    case 3 -> "배송 완료";
                    default -> "상태 변경";
                })
                .build();

        orderStatusHistoryRepository.save(history);
        orders.updateStatus(newStatus);

        log.info("주문 상태 변경 - orderId: {}, {} → {}", orderId, orders.getStatus(), newStatus);
    }

    // 기존 getSellerOrders 수정
    @Override
    public Page<OrderResponseDTO> getSellerOrders(Long sellerId, Byte status, Pageable pageable) {
        if (status == null) {
            return ordersRepository.findBySellerIdOrderByCreatedAtDesc(sellerId, pageable)
                    .map(OrderResponseDTO::new);
        }
        return ordersRepository.findBySellerIdAndStatusOrderByCreatedAtDesc(sellerId, status, pageable)
                .map(OrderResponseDTO::new);
    }
    
    // 판매자 페이지 - 본인 점포 주문 검증
    @Override
    public OrderResponseDTO getSellerOrder(Long sellerId, Long orderId) {
        Orders orders = ordersRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주문입니다."));

        // 본인 상점 주문인지 검증
        if (!orders.getSeller().getId().equals(sellerId)) {
            throw new SecurityException("본인 상점의 주문만 조회할 수 있습니다.");
        }

        return new OrderResponseDTO(orders);
    }
	
}
