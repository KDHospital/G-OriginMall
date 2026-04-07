import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { getProducts, getCategories } from "../../api/productsApi"
import ProductNavBar from "./ProductNavBar"
import ProductSideNavBar from "./ProductSideNavBar"
import ProducstListHeader from "./ProducstListHeader"
import ProductCard from "./ProductCard"
import Pagination from "./Pagination"
import useCustomMove from "../../hooks/useCustomMove"
import ProductSortSelect from "./ProductSortSelect"


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

    const {page,size,refresh,sort,moveToList,moveToRead} = useCustomMove()
    const [serverData, setServerData] = useState(initState)

    const [categories, setCategories] = useState([])   // 전체 카테고리 트리
    const [parentCategory, setParentCategory] = useState(null) // 현재 1뎁스


        useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories()
                setCategories(res.data)
            } catch (err) {
                console.error('카테고리 로드 실패', err)
            }
        }
        fetchCategories()
    }, [])

    // 현재 선택된 categoryId로 1뎁스 찾기
    useEffect(() => {
        if (!categoryId) {
            //카테고리가 없으면 null, 전체상품
            setParentCategory(null)
            return
        }
        if (categories.length === 0) return

        // 선택된 카테고리가 속한 1뎁스 찾기
        const parent = categories.find(cat =>
            cat.children?.some(child => String(child.categoryId) === String(categoryId))
        ) || categories.find(cat => String(cat.categoryId) === String(categoryId))
        setParentCategory(parent || null) //null값으로 바꿔줌
    }, [categoryId, categories])

    useEffect(()=>{
        const fetchProducts = async () => {
            try {
                setLoading(true)
    
            // 1. 현재 페이지와 사이즈로 데이터 요청 (Spring Boot는 0페이지부터 시작하므로 page-1)
                const response = await getProducts({ page: page - 1, size: 12, categoryId: categoryId ?? undefined, sort, });
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
    },[page,size,refresh,categoryId,sort])

    if(loading) return <div>로딩 중...........</div>
    if (error) return <div>{error}</div>
    return(
        <div className="pt-24 pb-16 max-w-screen-2xl mx-auto px-6">
            {/* navigation bar */}
            <ProductNavBar product={product} />
            <div className="flex flex-col md:flex-row gap-12">
                {/* side nav bar */}
                <aside className="w-full md:w-64 shrink-0">
                    <ProductSideNavBar />
                </aside>
                {/* Product Canvas */}
                <section className="flex-1">
                    {/* Title & Sort */}
                    <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <ProducstListHeader title={parentCategory?.categoryName || '전체 상품'} desc={"김포 특산물을 신선하게 만나보세요!"}  />
                        {/* 필터 */}
                        <ProductSortSelect />
                    </header>
                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                        {product.map((product) => (
                            <div key={product.productId} product={product} onClick={()=>moveToRead(product.productId)} className="cursor-pointer">
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