import { getImageUrl } from "../../util/imagesUtil";

const ProductCard = ({item}) => {
    if (!item) return null;

    return(
        <div className="group flex flex-col">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-container-low mb-4">
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" data-alt={item.pname} src={getImageUrl(item.thumbnailImageUrl) || "https://placehold.co/278x347?text=Product Image not found!!"} />
            </div>
            <div className="space-y-1 px-1">
                <h3 className="font-manrope font-bold text-lg text-on-surface">{item.pname}</h3>
                <p className="font-manrope text-xs text-on-surface-variant line-clamp-1 italic">{item.categoryName}</p>
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