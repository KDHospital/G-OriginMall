import ProductDetailComponents from "../../components/products/ProductDetailComponents"
import BasicLayout from "../../layouts/BasicLayout"
import { useParams } from "react-router-dom"
const ProductDetailPage = () => {
    
    const {productId} = useParams()
    
    return(
        <BasicLayout>
            
            {/* 네비게이션바 */}
            {/* 상품 상세 컴포넌트 */}
            <ProductDetailComponents productId = {productId} />
        
        </BasicLayout>
    )
}
export default ProductDetailPage