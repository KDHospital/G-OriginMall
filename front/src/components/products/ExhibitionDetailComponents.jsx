import ProductDetailTopSec from "./ProductDetailTopSec"
import ProductDetailMidSec from "./ProductDetailMidSec"

const ExhibitionDetailComponents = ({productId}) => {
    return(
            <main className="pt-24 pb-20 max-w-7xl mx-auto px-6">                
                {/* 기획전 */}  
                <ProductDetailTopSec />
                <ProductDetailMidSec />
            </main>
    )

}
export default ExhibitionDetailComponents