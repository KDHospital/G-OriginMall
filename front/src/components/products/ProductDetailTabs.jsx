const ProductDetailTabs = () => {
    return(
        <div className="flex border-b border-outline-variant overflow-x-auto no-scrollbar">
            {/* Mid Section: Tabs */}
            <button className="px-8 py-4 border-b-2 border-primary text-primary font-bold whitespace-nowrap">Product Details</button>
            <button className="px-8 py-4 text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap">Q&amp;A</button>
            <button className="px-8 py-4 text-on-surface-variant hover:text-primary transition-colors whitespace-nowrap">Reviews (1,245)</button>
        </div>
    )
}
export default ProductDetailTabs