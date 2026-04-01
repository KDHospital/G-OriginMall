package com.example.gmall.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QOrders is a Querydsl query type for Orders
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QOrders extends EntityPathBase<Orders> {

    private static final long serialVersionUID = -1968204725L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QOrders orders = new QOrders("orders");

    public final StringPath address = createString("address");

    public final StringPath addressDetail = createString("addressDetail");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final QMember member;

    public final NumberPath<Long> orderId = createNumber("orderId", Long.class);

    public final ListPath<OrderItem, QOrderItem> orderItems = this.<OrderItem, QOrderItem>createList("orderItems", OrderItem.class, QOrderItem.class, PathInits.DIRECT2);

    public final DateTimePath<java.time.LocalDateTime> paidAt = createDateTime("paidAt", java.time.LocalDateTime.class);

    public final StringPath paymentKey = createString("paymentKey");

    public final StringPath paymentMethod = createString("paymentMethod");

    public final StringPath receiverName = createString("receiverName");

    public final StringPath receiverTel = createString("receiverTel");

    public final QMember seller;

    public final NumberPath<Byte> status = createNumber("status", Byte.class);

    public final ListPath<OrderStatusHistory, QOrderStatusHistory> statusHistories = this.<OrderStatusHistory, QOrderStatusHistory>createList("statusHistories", OrderStatusHistory.class, QOrderStatusHistory.class, PathInits.DIRECT2);

    public final NumberPath<Integer> totalPrice = createNumber("totalPrice", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final StringPath zipcode = createString("zipcode");

    public QOrders(String variable) {
        this(Orders.class, forVariable(variable), INITS);
    }

    public QOrders(Path<? extends Orders> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QOrders(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QOrders(PathMetadata metadata, PathInits inits) {
        this(Orders.class, metadata, inits);
    }

    public QOrders(Class<? extends Orders> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new QMember(forProperty("member")) : null;
        this.seller = inits.isInitialized("seller") ? new QMember(forProperty("seller")) : null;
    }

}

