import { Link } from "react-router-dom"

const cardItem = [
    {
        id:1,
        imgAlt:"김포금쌀이미지",
        imgSrc:"https://lh3.googleusercontent.com/aida-public/AB6AXuC6566Hnsf-9qst7Fdp-KOPOGUGFudJKS41SEzOZBlN-QasrSiAcIYir88iV0HU5aBz2Oy95kSn9dSRXSx4Q5irBN9ynoWVvGuDnK6MZphR1nuTJPcusmBa6PcT4EfyOwl3b6VTkEhjjzSvGIQ2wd2fmCIJjAC1DjDwLGFTm5wPct1BoHwF5CzHVaachXKoQXbhcnPkvKCZARRlt997OmLNCrjG-ghAj1WS8T6oN_RIsv_n78ldOJZNaSO9k_f17EAjuf9Dh5pA8nQ",
        path:"/",
        name:"김포 금쌀 1포대 (10kg)",
        desc:"한강을 주변으로 비옥하고 기름진 넓은 평야에서 생산되며,예부터 임금님 수라상에 올랐던 진상미로 오천년의 전통을 자랑하는 윤기 있고 맑고 깨끗하며 소립으로 심복백이 없는 투명한 쌀",
        price:45000,
        dcPrice:39900,
        discountRate:11
    },
    {   
        id: 2,
        imgAlt:"김포금쌀이미지",
        imgSrc:"https://lh3.googleusercontent.com/aida-public/AB6AXuC6566Hnsf-9qst7Fdp-KOPOGUGFudJKS41SEzOZBlN-QasrSiAcIYir88iV0HU5aBz2Oy95kSn9dSRXSx4Q5irBN9ynoWVvGuDnK6MZphR1nuTJPcusmBa6PcT4EfyOwl3b6VTkEhjjzSvGIQ2wd2fmCIJjAC1DjDwLGFTm5wPct1BoHwF5CzHVaachXKoQXbhcnPkvKCZARRlt997OmLNCrjG-ghAj1WS8T6oN_RIsv_n78ldOJZNaSO9k_f17EAjuf9Dh5pA8nQ",
        path:"/",
        name:"김포 금쌀 2포대 (10kg)",
        desc:"설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명",
        price:55000,
        dcPrice:29900,
        discountRate:30
    },
    {
        id: 3,
        imgAlt:"김포금쌀이미지",
        imgSrc:"https://lh3.googleusercontent.com/aida-public/AB6AXuC6566Hnsf-9qst7Fdp-KOPOGUGFudJKS41SEzOZBlN-QasrSiAcIYir88iV0HU5aBz2Oy95kSn9dSRXSx4Q5irBN9ynoWVvGuDnK6MZphR1nuTJPcusmBa6PcT4EfyOwl3b6VTkEhjjzSvGIQ2wd2fmCIJjAC1DjDwLGFTm5wPct1BoHwF5CzHVaachXKoQXbhcnPkvKCZARRlt997OmLNCrjG-ghAj1WS8T6oN_RIsv_n78ldOJZNaSO9k_f17EAjuf9Dh5pA8nQ",
        path:"/",
        name:"김포 금쌀 3포대 (10kg)",
        desc:"설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명 설명",
        price:50000,
        dcPrice:25000,
        discountRate:50
    },
]

const PopularProductsCard = () =>{
return(
    <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <h2 className="text-3xl font-black text-accent">인기 상품</h2>
                    <p className="text-slate-500 mt-2">G-Origin Mall에서 가장 인기 있는 상품들을 만나보세요!</p>
                </div>
                <Link to={"/"} className="text-primary font-bold flex items-center gap-1 group" href="#">
                    더보기 <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* <!-- Product Card 1 --> */}
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
                                    <span className="text-xl font-black text-primary">{item.dcPrice}원<span className="text-red-500 text-sm font-bold">{item.discountRate}%</span></span>
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