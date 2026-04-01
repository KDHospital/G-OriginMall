package com.example.gmall.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSns is a Querydsl query type for Sns
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSns extends EntityPathBase<Sns> {

    private static final long serialVersionUID = 601847250L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSns sns = new QSns("sns");

    public final DateTimePath<java.time.LocalDateTime> linkedAt = createDateTime("linkedAt", java.time.LocalDateTime.class);

    public final QMember member;

    public final StringPath provider = createString("provider");

    public final StringPath providerUserId = createString("providerUserId");

    public final NumberPath<Long> snsId = createNumber("snsId", Long.class);

    public QSns(String variable) {
        this(Sns.class, forVariable(variable), INITS);
    }

    public QSns(Path<? extends Sns> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSns(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSns(PathMetadata metadata, PathInits inits) {
        this(Sns.class, metadata, inits);
    }

    public QSns(Class<? extends Sns> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new QMember(forProperty("member")) : null;
    }

}

