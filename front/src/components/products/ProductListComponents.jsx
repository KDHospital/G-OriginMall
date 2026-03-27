import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { getProducts } from "../../api/productsApi"
import ProductNavBar from "./ProductNavBar"
import ProductSideNavBar from "./ProductSideNavBar"
import ProducstListHeader from "./ProducstListHeader"
import ProductCard from "./ProductCard"
import Pagination from "./Pagination"
import useCustomMove from "../../hooks/useCustomMove"


const ProductListComponents = () => {
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

    const [searchParams] = useSearchParams()
    const categoryId = searchParams.get('categoryId')
    const [product,setProduct] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const {page,size,refresh,moveToList,moveToRead} = useCustomMove()
    const [serverData, setServerData] = useState(initState)

    useEffect(()=>{
        const fetchProducts = async () => {
            try {
                setLoading(true)
    
            // 1. 현재 페이지와 사이즈로 데이터 요청 (Spring Boot는 0페이지부터 시작하므로 page-1)
                const response = await getProducts({ page: page - 1, size: 12, categoryId: categoryId });
                console.log("백엔드 전체응답:", response.data)
                const data = response.data
                const totalPage = data.totalPages
                 const current = data.number + 1; // 서버는 0부터, 우리는 1부터
                setProduct(response.data.content);
                // 페이지 번호 배열 만들기 (예: 1~5, 6~10)
                const tempPageList = [];
                const start = Math.floor((current - 1) / 10) * 10 + 1;
                const end = Math.min(start + 9, totalPage);
                for(let i = start; i <= end; i++) tempPageList.push(i);
                setServerData({
                    dtoList: data.content,
                    pageNumList: tempPageList,
                    totalPage: totalPage,
                    prev: !data.first,
                    next: !data.last,
                    current: current,
                    totalCount: data.totalElements
                });
                setProduct(data.content);
            } catch (err) {
                setError('상품 로딩 실패!!!! 이유 :')
                console.error(err)
                console.error("API 요청 에러 상세:", err.response); 
                setError(`상품 로딩 실패! (에러코드: ${err.response?.status})`);
            } finally{
                setLoading(false)
            }
        }
        fetchProducts()
    },[page,size,refresh,categoryId])

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
                            <div key={product.productId} onClick={()=>moveToRead(product.productId)}>
                                <ProductCard item={product} />
                            </div>
                        ))}
                    </div>
                    <Pagination serverData={serverData} movePage={moveToList} />
                </section>
            </div>
        </div>        
    )
}

export default ProductListComponents