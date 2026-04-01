import { useState } from "react";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";


const ProductInfo = ({product}) => {
    const navigate = useNavigate();

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
         navigate("/orders/new", {
            state: {
            source: "direct",
            orderItems: [
                {
                cartItemId: null,
                productId: product.productId,
                sellerId: product.sellerId,
                sellerName: product.sellerName,
                pname: product.pname,
                listPrice: product.listPrice,
                discountPrice: product.discountPrice,
                price: product.price,
                deliveryFee: product.deliveryFee,
                quantity: quantity,  // 수량 선택 state
                itemSubtotal: product.price * quantity,
                thumbnailImageUrl: product.thumbnailImageUrl,
                }
            ]
            }
        });
    };

    //장바구니 담기
    const handleAddToCart = async()=>{
        try {
            await axiosInstance.post("/cart",{
                productId:product.productId,
                quantity: quantity,
            })
            alert(`${product.pname} ${quantity}개를 장바구니에 담았습니다.`)
        } catch (err) {
            console.error(err)
            //401:로그인이 안 된 경우 / 그 외 서버오류 시
            if (err.response?.status === 401) {
                alert("로그인이 필요합니다.")
            }else {
                alert("장바구니 담기에 실패했습니다.")
            }
        }
    }

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
                        구매하기
                    </button>
                    <button
                    onClick={handleAddToCart}
                    disabled={product.soldStatus !== 0}
                    className="flex-1 bg-surface-container-highest text-primary py-4 rounded-xl font-bold text-lg hover:bg-surface-container-high transition-all active:scale-95">
                        장바구니
                    </button>
                    {/* 품절 안내 */}
                    {product.soldStatus === 2 && (
                        <p className="text-center text-error font-bold">현재 품절된 상품입니다.</p>
                    )}
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