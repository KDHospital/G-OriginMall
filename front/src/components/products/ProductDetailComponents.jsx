import { useEffect,useState } from "react"
import { useSearchParams } from "react-router-dom"
import { getProductDetail } from "../../api/productsApi"
import useCustomMove from "../../hooks/useCustomMove"
import ProductDetailTopSec from "./ProductDetailTopSec"
import ProductDetailMidSec from "./ProductDetailMidSec"

const initState = {
  productId : 0,
  pname : '',
  pdesc : '',
  listPrice : 0,
  discountPrice : 0,
  price : 0,
  stock : 0,
  deliveryFee : 0   
}

const ProductDetailComponents = ({productId}) => {

    const [searchParams] = useSearchParams();    // 목록에서 들고 온 쿼리스트링
    const { moveToList } = useCustomMove();      // 목록 복귀용

    const [product, setProduct] = useState(initState);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    useEffect(()=>{
        if (!productId) return;
        const fetchProduct = async ()=>{
            try {
                setLoading(true)
                const response = await getProductDetail(productId)
                setProduct(response.data)
            } catch (err) {
                setError('상품 정보를 불러올 수 없습니다.')
                console.error(err)
            }finally{
                setLoading(false)
            }
        }
        fetchProduct()
    },[productId])

    if(loading) return <div>로딩 중...........</div>
    if (error) return <div>{error}</div>
    if (!product) return <div>상품 정보가 없습니다.</div>

    const statusLabel = {
        0: '구매 가능',
        1: '판매 중지',
        2: '품절',
        3: '삭제됨'
    }[product.soldStatus] ?? '알 수 없음'

    const handleBackToList = () => {
        moveToList({
        page: searchParams.get('page') ?? 1,
        size: searchParams.get('size') ?? 12,
        })
    }
    return(
        <main className="pt-24 pb-20 max-w-7xl mx-auto px-6">
            {/* 목록으로 */}
            <button
                onClick={handleBackToList}
                className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                리스트로 돌아가기
            </button>            
            <ProductDetailTopSec product={product} />
            <ProductDetailMidSec product={product} />
        </main>
    )
}

export default ProductDetailComponents