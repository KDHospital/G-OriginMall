import { getImageUrl } from "../../util/imagesUtil"

const SellerInfo = ({ product }) => {
    if (!product) return null

    return (
        <div className="py-16 space-y-8">
            {/* 판매자 카드 */}
            <div className="bg-surface-container-low rounded-2xl p-8 space-y-6">
                {/* 판매자 헤더 */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-on-surface-variant">storefront</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-xl text-on-surface">
                                {product.sellerName}
                            </h3>
                            {/* 김포시 인증 판매자 배지 */}
                            {product.sellerVerified && (
                                <span className="flex items-center gap-1 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                                    <span className="material-symbols-outlined text-sm">verified</span>
                                    김포시 인증
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-on-surface-variant mt-1">
                            사업자번호: {product.sellerBusinessNo ?? '정보 없음'}
                        </p>
                    </div>
                </div>

                {/* 구분선 */}
                <hr className="border-outline-variant/20" />

                {/* 안내 문구 */}
                <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-lg text-primary mt-0.5">local_shipping</span>
                        <span>주문 후 1~3일 이내 발송됩니다. (주말·공휴일 제외)</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-lg text-primary mt-0.5">assignment_return</span>
                        <span>상품 수령 후 7일 이내 교환·반품 가능합니다.</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-lg text-primary mt-0.5">support_agent</span>
                        <span>문의사항은 고객센터 또는 1:1 문의를 이용해주세요.</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SellerInfo