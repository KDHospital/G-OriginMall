import { useState } from "react"
import ProductDetailTabs from "./ProductDetailTabs"
import DetailedDescription from "./DetailedDescription"
import SellerInfo from "./SellerInfo"

const ProductDetailMidSec = ({product}) => {

    const [activeTab, setActiveTab] = useState('info')

    return(
        <div className="mt-24">
            <ProductDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
            {/* 탭 내용 */}
            {activeTab === 'info' && (
                <DetailedDescription product={product} />
            )}
            {activeTab === 'seller' && (
                <div className="py-16">
                    {/* 판매자 정보*/ }
                    <SellerInfo product={product} />

                </div>
            )}
        </div>
    )
}
export default ProductDetailMidSec