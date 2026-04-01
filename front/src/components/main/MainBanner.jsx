import { Link } from "react-router-dom"
const MainBanner = () => {
    return(
        <section className="relative h-[600px] overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center" data-alt="Scenic view of Gimpo golden rice fields at sunset">
                <img className="h-full" src={'https://i.postimg.cc/QC2bVvdW/Gemini-Generated-Image-51cwj551cwj551cw.png'} alt="메인배너이미지"  />
            </div>
            <Link key={1} to={"/"} className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-start text-white">
            </Link>
        </section>
    )
}
export default MainBanner