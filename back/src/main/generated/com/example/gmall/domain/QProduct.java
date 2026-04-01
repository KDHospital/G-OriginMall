package com.example.gmall.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QProduct is a Querydsl query type for Product
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QProduct extends EntityPathBase<Product> {

    private static final long serialVersionUID = 12830793L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QProduct product = new QProduct("product");

    public final QCategory category;

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Integer> deliveryFee = createNumber("deliveryFee", Integer.class);

    public final NumberPath<Integer> discountPrice = createNumber("discountPrice", Integer.class);

    public final BooleanPath isCertified = createBoolean("isCertified");

    public final BooleanPath isExhibition = createBoolean("isExhibition");

    public final NumberPath<Integer> listPrice = createNumber("listPrice", Integer.class);

    public final StringPath pdesc = createString("pdesc");

    public final StringPath pname = createString("pname");

    public final NumberPath<Integer> price = createNumber("price", Integer.class);

    public final NumberPath<Long> productId = createNumber("productId", Long.class);

    public final ListPath<ProductImage, QProductImage> productImages = this.<ProductImage, QProductImage>createList("productImages", ProductImage.class, QProductImage.class, PathInits.DIRECT2);

    public final QMember seller;

    public final NumberPath<Byte> soldStatus = createNumber("soldStatus", Byte.class);

    public final NumberPath<Integer> stock = createNumber("stock", Integer.class);

    public final StringPath thumbnailImageUrl = createString("thumbnailImageUrl");

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public QProduct(String variable) {
        this(Product.class, forVariable(variable), INITS);
    }

    public QProduct(Path<? extends Product> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QProduct(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QProduct(PathMetadata metadata, PathInits inits) {
        this(Product.class, metadata, inits);
    }

    public QProduct(Class<? extends Product> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.category = inits.isInitialized("category") ? new QCategory(forProperty("category"), inits.get("category")) : null;
        this.seller = inits.isInitialized("seller") ? new QMember(forProperty("seller")) : null;
    }

}

