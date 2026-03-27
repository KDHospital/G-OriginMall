const ProductInfo = ({product}) => {
    if (!product) return null;
    console.log(product)
    return(
        <div className="space-y-8">
            {/* Right: Info */}
            <div>
                <span className="inline-block bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Best Seller</span>
                <h1 className="font-headline text-4xl lg:text-5xl text-primary font-bold leading-tight mb-2">{product.pname}</h1>
                <div className="flex items-center gap-4 font-manrope">
                    <div className="flex items-center text-secondary">
                        <span className="material-symbols-outlined">star</span>
                        <span className="material-symbols-outlined">star</span>
                        <span className="material-symbols-outlined">star</span>
                        <span className="material-symbols-outlined">star</span>
                        <span className="material-symbols-outlined">star_half</span>
                        <span className="ml-2 text-on-surface font-bold">4.9</span>
                    </div>
                    <span className="text-on-surface-variant text-sm underline cursor-pointer">(1,245 reviews)</span>
                </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl space-y-2">
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-on-surface">39,900 KRW</span>
                    <span className="text-on-surface-variant line-through text-lg">45,000 KRW</span>
                    <span className="text-error font-bold text-lg">11% OFF</span>
                </div>
                <div className="flex flex-wrap gap-4 pt-4 border-t border-outline-variant/20">
                    <div className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-sm">local_shipping</span>
                        <span className="text-sm font-semibold">Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary">
                        <span className="material-symbols-outlined text-sm">bolt</span>
                        <span className="text-sm font-semibold">Ships Today</span>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <div className="flex items-center gap-6">
                    <span className="font-bold uppercase text-xs tracking-widest text-on-surface-variant">Quantity</span>
                    <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
                        <button className="px-4 py-2 hover:bg-surface-container-high text-primary"><span className="material-symbols-outlined text-sm">remove</span></button>
                        <span className="px-6 font-bold">1</span>
                        <button className="px-4 py-2 hover:bg-surface-container-high text-primary"><span className="material-symbols-outlined text-sm">add</span></button>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all active:scale-95">
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
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Certified Origin</span>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-60">
                    <span className="material-symbols-outlined text-3xl">eco</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Pesticide Free</span>
                </div>
                <div className="flex flex-col items-center gap-1 opacity-60">
                    <span className="material-symbols-outlined text-3xl">package_2</span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Eco Packaging</span>
                </div>
            </div>
        </div>

    )
}
export default ProductInfo