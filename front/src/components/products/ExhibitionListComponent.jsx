import { useState,useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { getExhibitionProducts } from "../../api/productsApi"
import ProducstListHeader from "./ProducstListHeader"
import ProductCard from "./ProductCard"
import Pagination from "../products/Pagination"
import useCustomMove from "../../hooks/useCustomMove"
import ProductSortSelect from "./ProductSortSelect"

const ExhibitionListComponent = () => {
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

    //주소 수집
    const [searchParams] = useSearchParams()
    const categoryId = searchParams.get('categoryId')
    //프로덕트
    const [product, setProduct] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const {page,size,refresh,sort,moveToExhibition,moveToExhibitionRead} = useCustomMove()
    //페이징네이션
    const [serverData,setServerData] = useState(initState)

    useEffect(()=>{
        const fetch = async()=>{
            try {
                setLoading(true)
                const res = await getExhibitionProducts({
                    page: page-1,
                    size,
                    categoryId: categoryId ?? undefined,
                    sort,                    
                })
                const data = res.data
                const current = data.number+1
                const totalPage = data.totalPages
                const tempPageList = []
                const start = Math.floor((current - 1) / 10) * 10 + 1
                const end   = Math.min(start + 9, totalPage)

                for (let i = start; i <= end; i++) tempPageList.push(i)

                setProduct(data.content)
                setServerData({
                    dtoList: data.content,
                    pageNumList: tempPageList,
                    totalPage,
                    prev: !data.first,
                    next: !data.last,
                    current,
                    totalCount: data.totalElements,
                })
            } catch (err) {
                setError(`기획전 상품 로딩 실패 (${err.response?.status})`)
                
            } finally {
                setLoading(false)
            }
        }
        fetch()
    },[page, size, refresh, categoryId, sort])


    if(loading) return <div>로딩 중...........</div>
    if (error) return <div>{error}</div>
    console.log("기획전 전체응답22:", product.data)
    return(
        <section>
            <div className="relative h-[400px] overflow-hidden">
                <div className="absolute inset-0 transition-opacity duration-700">
                    <img className="w-full h-full object-cover" src="https://i.postimg.cc/CKYp8Tyk/Gemini-Generated-Image-db84xddb84xddb84.png" alt="기획전 배너 이미지" />
                </div>
            </div>
            <div className="pt-20 pb-16 max-w-screen-2xl mx-auto px-6">
                {/* navigation bar */}
                <nav className="flex items-center gap-2 mb-8 text-on-surface-variant font-manrope text-sm">
                    <Link to={"/"} className="hover:text-primary">홈</Link>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="hover:text-primary">기획전</span>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="font-semibold text-primary">기획전 전체 상품</span>
                </nav>
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Product Canvas */}
                    <section className="flex-1">
                        {/* Title & Sort */}
                        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <ProducstListHeader title={'기획전'} desc={"G-Origin-Mall에서 직구매하여 저렴하게 판매하는 기획전 상품입니다!"}  />
                            {/* 필터 */}
                            <ProductSortSelect />
                        </header>
                        {/* Product Grid */}
                        {product.length === 0 ? (
                        <div className="text-center py-24 text-on-surface-variant">
                            <span className="material-symbols-outlined text-5xl">inventory_2</span>
                            <p className="mt-4">등록된 기획전 상품이 없습니다.</p>
                        </div>
                        ) :
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                            {product.map((product) => (
                                <div key={product.productId} product={product} onClick={()=>moveToExhibitionRead(product.productId)}>
                                    <ProductCard item={product} />
                                </div>
                            ))}
                        </div>}
                        <Pagination serverData={serverData} movePage={moveToExhibition} />
                    </section>
                </div>
            </div>    


        </section>
    )
}
export default ExhibitionListComponent