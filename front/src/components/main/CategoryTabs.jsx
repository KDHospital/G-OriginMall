import { Link } from "react-router-dom"

const categories = [
    {id: 1, name: "곡물", icon:"grass",path:"/"},
    {id: 2, name: "과일", icon:"nutrition",path:"/"},
    {id: 3, name: "채소", icon:"eco",path:"/"},
    {id: 4, name: "해산물", icon:"set_meal",path:"/"},
    {id: 5, name: "밀키트", icon:"restaurant",path:"/"},
    {id: 6, name: "선물세트", icon:"redeem",path:"/"},
]

const CategoryTabs = () => {
    return(
        <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex overflow-x-auto pb-4 gap-8 no-scrollbar justify-between">                    
                    {categories.map((item)=>(
                        <Link key={item.id}
                        to={item.path}
                        className="flex flex-col items-center gap-3 min-w-[80px] group cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                            </div>
                            <span className="text-sm font-bold">{item.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
export default CategoryTabs