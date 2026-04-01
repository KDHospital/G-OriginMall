import { useState } from "react"
import { getImageUrl } from "../../util/imagesUtil";

const ProductGallery = ({product}) => {

    if (!product) return null;

    // 메인 이미지 초기값: thumbnailImageUrl, 없으면 imageUrls 첫 번째
    const initialImage = product.thumbnailImageUrl || product.imageUrls?.[0] || '';
    const [mainImage, setMainImage] = useState(initialImage);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // 썸네일 목록: thumbnailImageUrl + imageUrls 합치기 (중복 제거)
    const allImages = [
        ...(product.thumbnailImageUrl ? [product.thumbnailImageUrl] : []),
        ...(product.imageUrls || []).filter(url => url !== product.thumbnailImageUrl)
    ];

    const handleThumbnailClick = (url, index) => {
        setMainImage(url);
        setSelectedIndex(index);
    };

    return(
        <div className="space-y-6">
            {/* Left: Gallery */}
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden aspect-square flex items-center justify-center p-8">
                <img alt="Gimpo Gold Rice Main" className="w-full h-full object-contain" data-alt="large bag of premium Gimpo Gold Rice standing upright on a rustic wooden surface with sunbeams and scattered raw rice grains" src={getImageUrl(mainImage) || "https://placehold.co/278x347?text=Product Image not found!!"} />
            </div>
            {/* 추가 이미지가 2장 이상일 때만 썸네일 목록 노출 */}
            {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {allImages.map((url, index) => (
                        <div
                            key={index}
                            onClick={() => handleThumbnailClick(url, index)}
                            className={`bg-white rounded-lg overflow-hidden aspect-square cursor-pointer border-2 transition-colors
                                ${selectedIndex === index
                                    ? 'border-primary'
                                    : 'border-outline-variant hover:border-primary'
                                }`}
                        >
                            <img
                                alt={`${product.pname} 이미지 ${index + 1}`}
                                className="w-full h-full object-cover"
                                src={getImageUrl(url)}
                            />
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}
export default ProductGallery