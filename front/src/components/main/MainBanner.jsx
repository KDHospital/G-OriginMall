import { Link } from "react-router-dom"

const bannerItem = [
    {
        id:1,
        badgetxt:"뱃지",
        title:"타이틀",
        subTit:"서브 타이틀",
        desc:"설명 설명 설명 설명 설명 설명 설명 설명 설명",
        imgAlt:"배너 이미지 1",
        path:"/",
    }
]

const MainBanner = () => {
    return(
        <section className="relative h-[600px] overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center" data-alt="Scenic view of Gimpo golden rice fields at sunset">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/60 to-transparent"></div>
            </div>
            <Link key={bannerItem.id} to={bannerItem.path} className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-start text-white">
                <span className="bg-secondary text-accent px-4 py-1 rounded-full text-sm font-bold mb-4">{bannerItem.badgetxt}</span>
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1]">{bannerItem.title}<br /><span className="text-secondary">{bannerItem.subTit}</span></h1>
                <p className="text-lg md:text-xl max-w-lg mb-8 opacity-90">{bannerItem.desc}</p>
                <div className="flex gap-4">
                    <Link to={"/"} className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-all">기획전 페이지로 이동</Link>
                    <Link to={"/"} className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all">상품 보기</Link>
                </div>
            </Link>
        </section>
    )
}
export default MainBanner