import { useState } from "react"

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
                <img alt="Gimpo Gold Rice Main" className="w-full h-full object-contain" data-alt="large bag of premium Gimpo Gold Rice standing upright on a rustic wooden surface with sunbeams and scattered raw rice grains" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs2SBeidvTEEdyBVjVrYuCCXvwaf0mHsVVRAwxzkEyB3dXyVcBFq9ouhPaoOlU5Ma8ASLyX24gXszghx3n5keb3zWJuWdl5xksJ8jja2AiEH1qEwLPyOBiuhLb_WrKHSpVN0g7IirMbqKB3s-PH4ad5hp9Rmk8l_BxqA2OOtkUnFuDYH4DsqHsUurIi_knJwqQqu9-W-fPTjNi7Mrl_QVifV4elpsQFt6Q94ExJ-F5KrTEE14699srUmKZspBgd3nMFEzBGMFxVH8" />
            </div>
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg overflow-hidden border-2 border-primary aspect-square cursor-pointer">
                    <img alt="Thumbnail 1" className="w-full h-full object-cover" data-alt="front view of the Gimpo Gold Rice 10kg packaging detail" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhDl9MzFpzItLA3w_w6VCk-qL49Grsda-epG3L8jCUjTWrOV-BDyZQwHyBTFEpxA6Q_QUIy3WmfqKc5LUiZZhqeE7fTVikRF8UbNYaXp8kLGMBsJgGIHMUpp8sevqcyWtYcmPW0POnt7TpmpE3KEW6chvcY5snD8h3m5IwU25-EJa1t4G5p891UO9iwsdJIJ995O5gSSfn3WiYEi-FPruzfx5si267ReGBFe4KjSxeQMxnywaUTqWfBy-tzh361eUgmIkfzTQp69o" />
                </div>
                <div className="bg-white rounded-lg overflow-hidden border border-outline-variant aspect-square cursor-pointer hover:border-primary transition-colors">
                    <img alt="Thumbnail 2" className="w-full h-full object-cover" data-alt="extreme close up of raw Gimpo Gold rice grains showing translucent quality and uniform size" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdIioJ4iMvadTmcuNdmkbR3lGJ8b7RMWa2gDK982gx8UloRadLZppmWqPH6JFuPMP3si7DlldF-ORcDbs7h-pbQZ7XQ0C8Q6zd5ziIT3V_eRnTvaKBSI1bE1J-5EeKyKIJM_cXtDWVbhgU_1RMsW4iLG7vH2T70JuHYotDhwdBGdbySUi48eNPaZ7QoMEuY6DRB_ohaRdIRsRp7flBFJfHfZIKz7LdTnvHQH1EojxTfPSRh9rsGdsXwLhpIDH0zhgu6oXluGjviDI" />
                </div>
                <div className="bg-white rounded-lg overflow-hidden border border-outline-variant aspect-square cursor-pointer hover:border-primary transition-colors">
                    <img alt="Thumbnail 3" className="w-full h-full object-cover" data-alt="scenic view of golden rice fields in Gimpo during harvest season under a clear blue sky" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxbSNRVstWWAuyAXET5IgOxpCL2jzc4l4xlDvFqzZYOBnS8dTTGp3EJBuWFM2pF01cCMbBKzDprmGg7TIQ1nA_Lfj_DgfTT6NkThjneQxDlbSJ2JkhAIlo9zJo5o8Zg0Zjrb7ez88JoXgY7_d76bJNpuEG3NwhxnHOjcwwz-JC5phSHhPXKMIfU2kXfTKjpCxGNueNwZ8bRxEbLuMSAXm2uvcmfkdKgJHMq4HlxOY45t3xe5PsnxQRtZMSz4tWmZX7ovAAMVCNgEk" />
                </div>
                <div className="bg-white rounded-lg overflow-hidden border border-outline-variant aspect-square cursor-pointer hover:border-primary transition-colors">
                    <img alt="Thumbnail 4" className="w-full h-full object-cover" data-alt="steaming bowl of freshly cooked fluffy white rice in a traditional ceramic bowl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyR74_5jbuInmaVR2O7eQMb8cdIU8aHpyg7v0vIWtXFJhuc5UBz2lbfiS4t_kbSVF-c5PVzFS8rYIwM7T0aIRK22D4gVrJPuk81lYhCaSt93rKjx9VgX8_2EVW4IzFNElpRRZtm4plRx33l-QS4CtSqO2nEFwC8GPt4g1YnBdPI34TIUtz5RH_g9bTPs3QstR_nKwDQP39QQNv3Kw4yaeq0lRxiRiHW3G7at43DT0uvU61xR4o-8IdJdNgD0Xslp8zqRZEw_V4M8g" />
                </div>
            </div>
        </div>
    )
}
export default ProductGallery