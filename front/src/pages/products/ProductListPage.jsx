import { useState, useEffect } from "react"
import { getProducts } from "../../api/productsApi"
import BasicLayout from "../../layouts/BasicLayout"
import ProductNavBar from "../../components/products/ProductNavBar"
import ProductSideNavBar from "../../components/products/ProductSideNavBar"
import ProducstListHeader from "../../components/products/ProducstListHeader"
import ProductCard from "../../components/products/ProductCard"
import Pagination from "../../components/products/Pagination"

const ProductListPage = () => {

    const [product,setProduct] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(()=>{
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const response = await getProducts({page:0, size:12})
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

// const cardItem = [
//     {
//         id:1,
//         imgAlt:"김포금쌀이미지-프로덕트",
//         imgSrc:"https://lh3.googleusercontent.com/aida-public/AB6AXuDwlua0DSNUvHafsa0wfC32U526eHZ1pvYiFLamWqT2IY4TvcxB3R6Vg7-E_95fMJDglzFOnXxZOhE4v-Vfzhgk2-YCTn-ls8vm37L3GkGleaoIk4zUeBspsF2LkKgQetXfqU5-QHKcp5miYjwyjMSUdtFlXvUm8-IlKp63TEvNEPdJ8DdylWZEAdZ7_zl3Rbj8EomIt6CFH1Ol4HEzQor_RJCTmwdvviIfr9SrXjcxUa06kFb4D0-OboNVOpvcV0FJRyVqNux1p_0",
//         path:"/",
//         name:"김포 금쌀 1포대 (10kg)",
//         desc:"한강을 주변으로 비옥하고 기름진 넓은 평야에서 생산되며,예부터 임금님 수라상에 올랐던 진상미로 오천년의 전통을 자랑하는 윤기 있고 맑고 깨끗하며 소립으로 심복백이 없는 투명한 쌀",
//         price:45000,
//         dcPrice:39900,
//         discountRate:11
//     }
// ]
    return(
        <BasicLayout>
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
                        <ProducstListHeader title={"타이틀입니다"}  />
                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                            {product.map((product) => (
                                <ProductCard key={product.id} item={product} />
                            ))}
                        </div>
                        <Pagination />
                    </section>
                </div>
            </div>
                
        


        </BasicLayout>
    )

}

export default ProductListPage