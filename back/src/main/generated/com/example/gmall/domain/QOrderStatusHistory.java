package com.example.gmall.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QOrderStatusHistory is a Querydsl query type for OrderStatusHistory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QOrderStatusHistory extends EntityPathBase<OrderStatusHistory> {

    private static final long serialVersionUID = 1816655866L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QOrderStatusHistory orderStatusHistory = new QOrderStatusHistory("orderStatusHistory");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Byte> fromStatus = createNumber("fromStatus", Byte.class);

    public final NumberPath<Long> historyId = createNumber("historyId", Long.class);

    public final StringPath memo = createString("memo");

    public final QOrders orders;

    public final QMember seller;

    public final NumberPath<Byte> toStatus = createNumber("toStatus", Byte.class);

    public QOrderStatusHistory(String variable) {
        this(OrderStatusHistory.class, forVariable(variable), INITS);
    }

    public QOrderStatusHistory(Path<? extends OrderStatusHistory> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QOrderStatusHistory(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QOrderStatusHistory(PathMetadata metadata, PathInits inits) {
        this(OrderStatusHistory.class, metadata, inits);
    }

    public QOrderStatusHistory(Class<? extends OrderStatusHistory> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.orders = inits.isInitialized("orders") ? new QOrders(forProperty("orders"), inits.get("orders")) : null;
        this.seller = inits.isInitialized("seller") ? new QMember(forProperty("seller")) : null;
    }

}

