import { Link } from "react-router-dom"
import { useState,useEffect } from "react"
import { getProducts } from "../../api/productsApi"
import { getImageUrl } from "../../util/imagesUtil"

const PopularProductsCard = () =>{
    // 1. 데이터를 담을 상태(state) 선언
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState([true])

    useEffect(()=>{
        const fetchPopularProducts = async()=>{
            try {
                // 인기 상품만 가져오는 API가 따로 없다면, 
                // 일단 전체 목록의 첫 페이지(예: 3개)만 가져오게 설정
                const response = await getProducts(null,0,3)
                setProducts(response.content || response.data.content||[])
            } catch (error) {
                console.error("인기상품 로딩 실패",error)                
            } finally{
                setLoading(false)
            }
        }
        fetchPopularProducts()
    },[])

    if (loading) return <div>상품 불러오는 중...</div>

return(
    <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <h2 className="text-3xl font-black text-accent">인기 상품</h2>
                    <p className="text-slate-500 mt-2">G-Origin Mall에서 가장 인기 있는 상품들을 만나보세요!</p>
                </div>
                <Link to={"/products"} className="text-primary font-bold flex items-center gap-1 group" href="#">
                    더보기 <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* <!-- Product Card 1 --> */}
                {products.slice(0, 3).map((item)=>(
                    <Link key={item.productId} to={`/products/${item.productId}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
                        <div className="relative h-64 overflow-hidden">
                            <img src={getImageUrl(item.thumbnailImageUrl) || "https://placehold.co/278x347?text=Product Image not found!!"} alt={item.pname}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg">{item.pname}</h4>
                            </div>       
                            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{item.pdesc}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-slate-400 line-through text-xs font-medium">{item.price.toLocaleString()}원</span>
                                    <span className="text-xl font-black text-primary">{item.listPrice.toLocaleString()}원<span className="text-red-500 text-sm font-bold ml-2">{Math.round((item.discountPrice/item.listPrice)*100).toLocaleString()}% OFF</span></span>
                                </div>
                                <button className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                                    <span className="material-symbols-outlined">add_shopping_cart</span>
                                </button>
                            </div>                                                 
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </section>
)
}
export default PopularProductsCard