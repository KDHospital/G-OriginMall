import { Link } from "react-router-dom"

const ProductCard = ({item}) => {
    if (!item) return null;

    return(
        <Link to={`/products/${item.productId}`} className="group flex flex-col">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-container-low mb-4">
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" data-alt={item.pname} src={item.thumbnailImageUrl || "https://placehold.co/278x347?text=Product Image not found!!"} />
                <button className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                    <span className="material-symbols-outlined">shopping_cart</span>
                </button>
            </div>
            <div className="space-y-1 px-1">
                <h3 className="font-manrope font-bold text-lg text-on-surface">{item.pname}</h3>
                <p className="font-manrope text-xs text-on-surface-variant line-clamp-1 italic">{item.categoryName}</p>
                <div className="flex items-center gap-2 pt-2">
                    <span className="font-manrope font-extrabold text-primary text-xl tracking-tight">{(item.discountPrice||0).toLocaleString()}원</span>
                    <span className="font-manrope text-sm text-outline line-through">{item.price.toLocaleString()}원</span>
                    <span className="font-manrope text-xs font-bold text-secondary">{item.stock}% OFF</span>
                </div>
            </div>
        </Link>
    )

}
export default ProductCard