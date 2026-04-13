import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { getActiveBanners } from "../../api/bannerApi"
import { getImageUrl } from "../../util/imagesUtil"

const MainBanner = () => {
    //배너 목록 담기
    const [banners, setBanners] = useState([])
    //슬라이드 정보
    const [current, setCurrent] = useState(0)
    useEffect(()=>{
        const fetchBanners = async () =>{
            try {
                const res = await getActiveBanners()
                setBanners(res.data)
                console.log(res.data)
            } catch (err) {
                console.error('배너 목록 로드 실패',err)
            }
        }
        fetchBanners()
    },[])

    //자동 슬라이드 (5초)
    useEffect(()=>{
        if (banners.length <= 1) return
        const timer = setInterval(() => {
           setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer)
    },[banners])

    const prev = () => setCurrent(p => (p - 1 + banners.length) % banners.length)
    const next = () => setCurrent(p => (p + 1) % banners.length)

    if (banners.length === 0) return null

    return(
        <section className="relative h-[600px] overflow-hidden">
            {banners.map((banner,idx)=>(
                <Link 
                key={banner.bannerId}
                to={banner.linkUrl || '#'}
                className={`absolute inset-0 transition-opacity duration-700
                        ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>

                    <img
                    src={`${getImageUrl(banner.imageUrl)}`}
                    alt={`배너 ${idx + 1}`}
                    className="w-full h-full object-cover"
                    />
                </Link>
            ))}
            {/* 좌우 화살표 */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </>
            )}
            {/* 하단 인디케이터 (여기에도 return 확인!) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {banners.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${idx === current ? 'bg-white w-8' : 'bg-white/50'}`}
                    />
                ))}
            </div>

        </section>
    )
}
export default MainBanner