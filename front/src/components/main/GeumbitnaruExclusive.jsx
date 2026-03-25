import { Link } from "react-router-dom"
import GimpoLogo from "../../assets/Gimpo_CI.png"

const cardItem = [
    {
        id:1,
        imgAlt:"금빛나루 상품1",
        imgSrc:"https://lh3.googleusercontent.com/aida-public/AB6AXuDD-vVckIi7EVVEyq7ayLgG9KaCXSsh5Jd4LLRZPGwsNS3uwkyB-OOVP6Dde9g-p3YbDwRsmbEzxNnh-YXiN-7sByRzTf7nqZHk44VVbIAtIm_sQJuvz7DDYKwe15SZNbzVZfSA1Q_lzJxbDQ_43syOVbDeziIwS3hVH5PEstFTfMSachl2cvtEM24of2aZ33OVxB9K6R16rAHj75DqBiw09ldVzpl4JSU0avBky13FgQqRrmvY7vRij6ahxUy6obTo77RbLGWiNt0",
        path:"/",
        name:"금빛나루 상품 1",
        desc:"밤낮의 온도가 뚜렷한 해양성 기후와 붉은 점질토양 등 천혜의 자연조건 속에서 생산된 김포배는 소비자의 건강을 최우선으로 생각하며 정성들여 생산한 배로서 특유의 고유한 맛과 영양이 그대로 살아 있다.",
        price:45000,
    },
    {   
        id: 2,
        imgAlt:"금빛나루 상품2",
        imgSrc:"https://lh3.googleusercontent.com/aida-public/AB6AXuDD-vVckIi7EVVEyq7ayLgG9KaCXSsh5Jd4LLRZPGwsNS3uwkyB-OOVP6Dde9g-p3YbDwRsmbEzxNnh-YXiN-7sByRzTf7nqZHk44VVbIAtIm_sQJuvz7DDYKwe15SZNbzVZfSA1Q_lzJxbDQ_43syOVbDeziIwS3hVH5PEstFTfMSachl2cvtEM24of2aZ33OVxB9K6R16rAHj75DqBiw09ldVzpl4JSU0avBky13FgQqRrmvY7vRij6ahxUy6obTo77RbLGWiNt0",
        path:"/",
        name:"김포 금쌀 2포대 (10kg)",
        desc:"설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명",
        price:55000,
    },
    {
        id: 3,
        imgAlt:"금빛나루 상품3",
        imgSrc:"https://lh3.googleusercontent.com/aida-public/AB6AXuDD-vVckIi7EVVEyq7ayLgG9KaCXSsh5Jd4LLRZPGwsNS3uwkyB-OOVP6Dde9g-p3YbDwRsmbEzxNnh-YXiN-7sByRzTf7nqZHk44VVbIAtIm_sQJuvz7DDYKwe15SZNbzVZfSA1Q_lzJxbDQ_43syOVbDeziIwS3hVH5PEstFTfMSachl2cvtEM24of2aZ33OVxB9K6R16rAHj75DqBiw09ldVzpl4JSU0avBky13FgQqRrmvY7vRij6ahxUy6obTo77RbLGWiNt0",
        path:"/",
        name:"김포 금쌀 3포대 (10kg)",
        desc:"설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명",
        price:50000,
    },
]
const GeumbitnaruExclusive = () => {
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
                    {cardItem.map((item)=>(
                        <Link key={item.id} to={item.path} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
                            <div className="relative h-64 overflow-hidden">
                                <img src={item.imgSrc} alt={item.imgAlt}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-lg">{item.name}</h4>
                                </div>       
                                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{item.desc}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 line-through text-xs font-medium">{item.price}원</span>
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