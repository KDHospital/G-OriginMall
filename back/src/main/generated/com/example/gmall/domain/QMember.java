package com.example.gmall.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QMember is a Querydsl query type for Member
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMember extends EntityPathBase<Member> {

    private static final long serialVersionUID = -2037203968L;

    public static final QMember member = new QMember("member1");

    public final StringPath bankAccount = createString("bankAccount");

    public final StringPath businessNo = createString("businessNo");

    public final BooleanPath businessVerified = createBoolean("businessVerified");

    public final StringPath cashReceiptNo = createString("cashReceiptNo");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final ListPath<DeliveryAddress, QDeliveryAddress> deliveryAddresses = this.<DeliveryAddress, QDeliveryAddress>createList("deliveryAddresses", DeliveryAddress.class, QDeliveryAddress.class, PathInits.DIRECT2);

    public final StringPath description = createString("description");

    public final StringPath email = createString("email");

    public final BooleanPath emailVerified = createBoolean("emailVerified");

    public final NumberPath<Byte> gender = createNumber("gender", Byte.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isDeleted = createBoolean("isDeleted");

    public final BooleanPath isVerified = createBoolean("isVerified");

    public final StringPath loginId = createString("loginId");

    public final StringPath mname = createString("mname");

    public final StringPath mpwd = createString("mpwd");

    public final NumberPath<Byte> role = createNumber("role", Byte.class);

    public final StringPath settlementBank = createString("settlementBank");

    public final StringPath settlementName = createString("settlementName");

    public final ListPath<Sns, QSns> snsList = this.<Sns, QSns>createList("snsList", Sns.class, QSns.class, PathInits.DIRECT2);

    public final BooleanPath taxInvoice = createBoolean("taxInvoice");

    public final StringPath tel = createString("tel");

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> withdrawAt = createDateTime("withdrawAt", java.time.LocalDateTime.class);

    public QMember(String variable) {
        super(Member.class, forVariable(variable));
    }

    public QMember(Path<? extends Member> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMember(PathMetadata metadata) {
        super(Member.class, metadata);
    }

}

