import { Link } from "react-router-dom"
import { useState,useEffect } from "react"
import { getCertifiedProducts } from "../../api/productsApi"
import GimpoLogo from "../../assets/Gimpo_CI.png"
import { getImageUrl } from "../../util/imagesUtil"

const GeumbitnaruExclusive = () => {
    
    const [products, setProducts] = useState([]) 
    const [loading,setLoading] = useState([true])

    useEffect(()=>{
        const fetGeumbitnaruExclusive = async () =>{
            try {
                setLoading(true)
                const response = await getCertifiedProducts(null,0,3)
                setProducts(response.content || response.data.content||[])
            } catch (error) {
                console.error('금빛나루 상품 로딩 실패',error)
            }finally{
                setLoading(false)
            }
        }
        fetGeumbitnaruExclusive()
    },[])
    if (loading) return <div>상품 불러오는 중...</div>
    return(
        <section class="py-24 bg-accent overflow-hidden relative">
            <div class="absolute top-0 right-0 w-1/3 h-full opacity-20 pointer-events-none">
                <svg class="w-full h-full text-secondary" fill="none" viewbox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                    <path d="M400 200C400 310.457 310.457 400 200 400C89.543 400 0 310.457 0 200C0 89.543 89.543 0 200 0C310.457 0 400 89.543 400 200Z" fill="currentColor" fill-opacity="0.1"></path>
                </svg>
            </div>
            <div class="max-w-7xl mx-auto px-4 relative">
                <div class="text-center mb-16">
                    <img alt="Gimpo Logo" class="h-16 mx-auto mb-6" data-alt="김포시 로고" src={GimpoLogo} />
                    <h2 class="text-4xl font-black text-secondary mb-4 tracking-tight uppercase">금빛나루 인증</h2>
                    <p class="text-white/60 max-w-2xl mx-auto">'금빛나루'는 김포시에서 생산되는 우수한 농·특산물에 부여하는 통합 브랜드입니다.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* <!-- 금빛나루 상품 --> */}
                    {products.slice(0,3).map((item)=>(
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
                                        <span className="text-slate-400 line-through text-xs font-medium">{item.listPrice.toLocaleString()}원</span>
                                        <span className="text-xl font-black text-primary">{item.price.toLocaleString()}원<span className="text-red-500 text-sm font-bold ml-2">{Math.round((item.discountPrice/item.listPrice)*100).toLocaleString()}% OFF</span></span>                            
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

export default GeumbitnaruExclusive