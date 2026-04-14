import { getImageUrl } from "../../util/imagesUtil"

const DetailedDescription = ({ product }) => {
    if (!product) return null

    // imageUrls 배열에서 마지막 이미지 꺼내기
    // imageUrls가 없거나 비어있으면 null (썸네일만 있는 경우)
    const detailImage = product.detailImageUrl ?? null

    return (
        <div className="py-16 space-y-24">
            {/* 마지막 이미지 있을 때만 렌더링 */}
            {detailImage && (
                <img
                    src={getImageUrl(detailImage)}
                    alt={`${product.pname} 상세 설명`}
                    className="w-full rounded-xl"
                />
            )}

            {/* 이미지 없으면 텍스트 설명만 */}
            {product.pdesc && (
                <p className="text-on-surface-variant leading-relaxed whitespace-pre-line">
                    {product.pdesc}
                </p>
            )}
        </div>
    )
}
export default DetailedDescription