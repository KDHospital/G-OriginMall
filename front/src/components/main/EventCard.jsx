import { Link } from "react-router-dom"

const eventCardItem = [
    {
        id:1,
        imgAlt:"기획전 이미지 01",
        imgSrc:"https://lh3.googleusercontent.com/aida-public/AB6AXuCZhX9ZB1uGuqs90eF9mcRdwHnkQVTlgboUck5QlAe4hbQN8eTwvYIuwYraHXEJcs80SGc84Uj3S6GY0XVhunOPIlCp3Rn8mwH_dgOH--GgL8tc9XLuBuJnfuDfk6ayTAhItXLYWx1p5r4P-1bfOLukPAj2ZJTikcOB3E8oTuBQTqYLss6_XLmXfaMFd5452UPDgwxN4RK64VtAStgMa6k8Y-2UgvpxtZ344ijdfFBpk4jheN-dVO_zZJQWa40Hf1EBnrXnQu7BRVU",
        path:"/",
        title:"기획전 01",
        subTit:"김포 금쌀 빅 할인",
        desc:"기획전 설명",
    },
    {   
        id:2,
        imgAlt:"기획전 이미지 02",
        imgSrc:"https://lh3.googleusercontent.com/aida-public/AB6AXuCZhX9ZB1uGuqs90eF9mcRdwHnkQVTlgboUck5QlAe4hbQN8eTwvYIuwYraHXEJcs80SGc84Uj3S6GY0XVhunOPIlCp3Rn8mwH_dgOH--GgL8tc9XLuBuJnfuDfk6ayTAhItXLYWx1p5r4P-1bfOLukPAj2ZJTikcOB3E8oTuBQTqYLss6_XLmXfaMFd5452UPDgwxN4RK64VtAStgMa6k8Y-2UgvpxtZ344ijdfFBpk4jheN-dVO_zZJQWa40Hf1EBnrXnQu7BRVU",
        path:"/",
        title:"기획전 02",
        subTit:"김포 포도 스몰 할인",
        desc:"기획전 설명2222",
    },
]

const EventCard = () => {

    return(
        <section class="py-16 max-w-7xl mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {eventCardItem.map((item)=>(
                    <div key={item.id} class="group relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer">
                        <img alt={item.imgAlt} class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.imgSrc} />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                            <span class="text-secondary font-bold text-sm mb-2">{item.title}</span>
                            <h3 class="text-white text-3xl font-black mb-2">{item.subTit}</h3>
                            <p class="text-white/80 mb-4">{item.desc}</p>
                            <Link to={item.path} class="bg-white text-primary px-6 py-2 rounded-lg font-bold w-fit hover:bg-secondary hover:text-accent transition-colors">페이지 바로가기</Link>
                        </div>
                    </div> 
                ))}
            </div>
        </section>
    )
}
export default EventCard