import { useState,useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { getCertifiedProducts } from "../../api/productsApi"
import { Link } from "react-router-dom"
import ProducstListHeader from "./ProducstListHeader"
import ProductCard from "./ProductCard"
import Pagination from "../products/Pagination"
import useCustomMove from "../../hooks/useCustomMove"
import ProductSortSelect from "./ProductSortSelect"

const CertifiedListComponent = () => {
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

    const {page,size,refresh,sort,moveToCertified,moveToCertifiedRead} = useCustomMove()
    //페이징네이션
    const [serverData,setServerData] = useState(initState)

    useEffect(()=>{
        const fetchCertified = async () => {
            try {
                setLoading(true)
                const res = await getCertifiedProducts({
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
                setError(`금빛나루 상품 로딩 실패 (${err.response?.status})`)
            } finally {
                setLoading(false)
            }
        }
        fetchCertified()
    }, [page, size, refresh, categoryId, sort])

    if(loading) return <div>로딩 중...........</div>
    if (error) return <div>{error}</div>

    return(
        <div className="pt-24 pb-16 max-w-screen-2xl mx-auto px-6">
            {/* navigation bar */}
            <nav className="flex items-center gap-2 mb-8 text-on-surface-variant font-manrope text-sm">
                <Link to={"/"} className="hover:text-primary">홈</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <Link to={"/products/certified"} className="hover:text-primary">금빛나루 전용관</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="font-semibold text-primary">전체 상품</span>
            </nav>
            <div className="flex flex-col md:flex-row gap-12">
                {/* Product Canvas */}
                <section className="flex-1">
                    {/* Title & Sort */}
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <ProducstListHeader title={'금빛나루 전용관'} desc={"김포 특산물을 신선하게 만나보세요!"}  />
                        {/* 필터 */}
                        <ProductSortSelect />
                    </header>
                    {/* Product Grid */}
                    {product.length === 0 ? (
                    <div className="text-center py-24 text-on-surface-variant">
                        <span className="material-symbols-outlined text-5xl">inventory_2</span>
                        <p className="mt-4">등록된 인증 상품이 없습니다.</p>
                    </div>
                    ) :
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                        {product.map((product) => (
                            <div key={product.productId} product={product} onClick={()=>moveToCertifiedRead(product.productId)}>
                                <ProductCard item={product} />
                            </div>
                        ))}
                    </div>}
                    <Pagination serverData={serverData} movePage={moveToCertified} />
                </section>
            </div>
        </div>
    )
}
export default CertifiedListComponent