import { useState } from "react";


const ProductInfo = ({product}) => {
    if (!product) return null;
    console.log("프로덕트 인포의 프로덕트:", product);
    // 수량 변경 코드
    const [quantity, setQuantity] = useState(1);
    const MIN_QTY = 1;
    const MAX_QTY = product.stock;

    // 수량 감소 (1 미만 불가)
    const handleDecrease = () => {
        setQuantity(prev => Math.max(MIN_QTY, prev - 1));
    };

    // 수량 증가 (stock 초과 불가)
    const handleIncrease = () => {
        setQuantity(prev => Math.min(MAX_QTY, prev + 1));
    };

    // Buy Now
    const handleBuyNow = () => {
        alert('구매 페이지로 이동합니다');
        // 추후 navigate('/orders/new') 연결 예정
    };

    return(
        <div className="space-y-8">
            {/* Right: Info */}
            <div>
                {/* 베스트셀러인 경우 조건에 따라 하단의 뱃지를 노출시키는 로직 추가 예정 */}
                {/* <span className="inline-block bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Best Seller</span> */}
                <h1 className="font-headline text-4xl lg:text-5xl text-primary font-bold leading-tight mb-2">{product.pname}</h1>
            </div>
            
            <div className="bg-surface-container-low p-6 rounded-xl space-y-2">
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-on-surface">{(product.price||0).toLocaleString()}원</span>
                    <span className="text-on-surface-variant line-through text-lg">{product.listPrice.toLocaleString()}원</span>
                    <span className="text-error font-bold text-lg">{Math.round((product.discountPrice/product.listPrice)*100).toLocaleString()}% OFF</span>
                </div>
                <div className="flex flex-wrap gap-4 pt-4 border-t border-outline-variant/20">
                    <div className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-sm">local_shipping</span>
                        <span className="text-sm font-semibold">배송비: {product.deliveryFee.toLocaleString()}원</span>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <div>
                    <span className="text-s text-primary font-bold">현재 재고 수량 : {MAX_QTY}개</span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="font-bold uppercase text-xs tracking-widest text-on-surface-variant">수량</span>
                    <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
                        <button onClick={handleDecrease} disabled={quantity <= MIN_QTY} className="px-4 py-2 hover:bg-surface-container-high text-primary"><span className="material-symbols-outlined text-sm">remove</span></button>
                        <span className="px-6 font-bold">{quantity}</span>
                        <button onClick={handleIncrease} disabled={quantity >= MAX_QTY} className="px-4 py-2 hover:bg-surface-container-high text-primary"><span className="material-symbols-outlined text-sm">add</span></button>
                    </div>
                    {/* 최대치 도달 시 안내 */}
                    {quantity >= MAX_QTY && (
                        <span className="text-xs text-error">구매 가능한 최대 수량입니다.</span>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={handleBuyNow} className="flex-1 bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all active:scale-95">
                        Buy Now
                    </button>
                    <button className="flex-1 bg-surface-container-highest text-primary py-4 rounded-xl font-bold text-lg hover:bg-surface-container-high transition-all active:scale-95">
                        Add to Cart
                    </button>
                    <button className="w-16 h-16 flex items-center justify-center rounded-xl border border-outline-variant text-on-surface-variant hover:text-error hover:border-error transition-all">
                        <span className="material-symbols-outlined">favorite</span>
                    </button>
                </div>
            </div>
            <div className="pt-6 flex gap-8 items-center border-t border-outline-variant/30">
                <div className="flex flex-col items-center gap-1 opacity-60">
                    <span className="material-symbols-outlined text-3xl">verified</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">김포시 인증 상품</span>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-60">
                    <span className="material-symbols-outlined text-3xl">eco</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">유기농</span>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-60">
                    <span className="material-symbols-outlined text-3xl">package_2</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">친환경 포장</span>
                </div>
            </div>
        </div>

    )
}
export default ProductInfo