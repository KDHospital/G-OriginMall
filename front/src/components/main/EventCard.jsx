import { Link } from "react-router-dom"

const eventCardItem = [
    {
        id:1,
        imgAlt:"금빛나루 인증 기획전 배너 이미지",
        imgSrc:"https://i.postimg.cc/K8xGyg9T/Gemini-Generated-Image-8q7xfx8q7xfx8q7x.png",
        path:"/products/certified",
    },
    {   
        id:2,
        imgAlt:"지오리진몰 기획전 배너 이미지",
        imgSrc:"https://i.postimg.cc/1tkS7gnf/Gemini-Generated-Image-bx53afbx53afbx53.png",
        path:"/products/exhibition",
    },
]

const EventCard = () => {
    return(
        <section className="py-16 max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {eventCardItem.map((item)=>(
                    <Link key={item.id} to={item.path} className="group relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                        <img alt={item.imgAlt} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.imgSrc} />
                        <div className="absolute inset-0 p-8 flex flex-col justify-end items-end">
                            <button className="bg-white text-primary px-6 py-2 rounded-lg font-bold w-fit hover:bg-secondary hover:text-accent transition-colors">페이지 바로가기</button>
                        </div>
                    </Link> 
                ))}
            </div>
        </section>
    )
}
export default EventCard