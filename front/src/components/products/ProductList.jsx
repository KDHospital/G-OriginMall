import { useState, useEffect } from "react"
import { getProducts } from "../../api/productsApi"
import ProductNavBar from "../../components/products/ProductNavBar"
import ProductSideNavBar from "../../components/products/ProductSideNavBar"
import ProducstListHeader from "../../components/products/ProducstListHeader"
import ProductCard from "../../components/products/ProductCard"
import Pagination from "../../components/products/Pagination"

const ProductList = () => {
    const initState = {
        dtoList : [],
        pageNumList : [],
        pageRequestDTO : null,
        prev : false,
        next : false, 
        totalCount : 0,
        prevPage : 0,
        nextPage : 0,
        totalPage : 0,
        current: 0
    }

    
    const [product,setProduct] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [serverData, setServerData] = useState(initState)

    useEffect(()=>{
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const response = await getProducts({page:0, size:12})
                console.log("백엔드 데이터 구조 확인:", response.data.content[0]);
                // 스프링부트 Page 객체 응답 구조:
                // response.data.content      → 상품 배열
                // response.data.totalPages   → 전체 페이지 수
                // response.data.totalElements → 전체 상품 수
                setProduct(response.data.content);
            } catch (err) {
                setError('상품 로딩 실패!!!! 이유 :')
                console.error(err)
            } finally{
                setLoading(false)
            }
        }
        fetchProducts()
    },[])

    if(loading) return <div>로딩 중...........</div>
    if (error) return <div>{error}</div>


    return(
        <div className="pt-24 pb-16 max-w-screen-2xl mx-auto px-6">
            {/* navigation bar */}
            <ProductNavBar />
            <div className="flex flex-col md:flex-row gap-12">
                {/* side nav bar */}
                <aside className="w-full md:w-64 shrink-0">
                    <ProductSideNavBar />
                </aside>
                {/* Product Canvas */}
                <section className="flex-1">
                    {/* Title & Sort */}
                    <ProducstListHeader title={"타이틀입니다"} desc={"설명 설명 설명 설명 설명 설명 설명 설명 설명"}  />
                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                        {product.map((product) => (
                            <ProductCard key={product.productId} item={product} />
                        ))}
                    </div>
                    {/* <Pagination serverData={ser} /> */}
                </section>
            </div>
        </div>        
    )
}

export default ProductList