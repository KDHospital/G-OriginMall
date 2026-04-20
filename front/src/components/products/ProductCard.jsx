import { getImageUrl } from "../../util/imagesUtil";

const ProductCard = ({item}) => {
    if (!item) return null;

    return(
        <div className="group flex flex-col">
            {item.stock === 0 ? (
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-4">
                    <img
                        className="w-full h-full object-cover"
                        src={getImageUrl(item.thumbnailImageUrl) || "https://placehold.co/278x347?text=Product Image not found!!"}
                        alt={item.pname}
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                            품절입니다
                        </span>
                    </div>
                </div>
            ) : (
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-container-low mb-4">
                    <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={getImageUrl(item.thumbnailImageUrl) || "https://placehold.co/278x347?text=Product Image not found!!"}
                        alt={item.pname}
                    />
                </div>
            )}
            <div className="space-y-1 px-1">
                <h3 className="font-manrope font-bold text-lg text-on-surface truncate">{item.pname}</h3>
                <div className="flex justify-between">
                    <p className="font-manrope text-xs text-on-surface-variant line-clamp-1 italic">{item.categoryName}</p>
                    <div className="flex items-center">
                        {item.certified ? <span className={`text-xs px-2 py-1 mr-1 rounded-full font-medium bg-yellow-100 text-yellow-600}`}>금빛나루 인증</span>: <></>}
                        {item.exhibition ? <span className={`text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-600}`}>기획전 상품</span>: <></>}
                    </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                    <span className="font-manrope font-extrabold text-primary text-xl tracking-tight">{(item.price||0).toLocaleString()}원</span>
                    <span className="font-manrope text-sm text-outline line-through">{item.listPrice.toLocaleString()}원</span>
                    <span className="font-manrope text-xs font-bold text-secondary">{Math.round((item.discountPrice/item.listPrice)*100).toLocaleString()}% OFF</span>
                </div>
            </div>
        </div>
    )

}
export default ProductCard