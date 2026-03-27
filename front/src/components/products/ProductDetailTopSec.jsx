import ProductInfo from "./ProductInfo"
import ProductGallery from "./ProductGallery"

const ProductDetailTopSec = ({product}) => {
    return(
        // Top Product Section
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ProductGallery />
            <ProductInfo product={product} />
        </div>
    )
}
export default ProductDetailTopSec