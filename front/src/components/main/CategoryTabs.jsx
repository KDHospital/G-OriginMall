import { Link } from "react-router-dom"
import { useState,useEffect } from "react"
import { getCategories } from "../../api/productsApi"

const CategoryTabs = () => {

    //카테고리
    const [categories,setCategories] = useState([]) 

    useEffect(()=>{
        const fetchCategories = async () => {
            try {
                const res = await getCategories()
                setCategories(res.data)
            } catch (err) {
               console.error('카테고리 로드 실패',err) 
            }
        }
        fetchCategories()
    },[])
    //카테고리 이름에 맞는 아이콘 배정
    const getIconName = (item) => {
        switch (item.categoryName) {
            case '농산물': 
                return "wheat"
            case '수산물':
                return "set_meal"
            case '축산물':
                return "egg"
            case '가공품':
                return "stockpot"
            case '선물세트':
                return "featured_seasonal_and_gifts"
            default:
            return "category"; // 기본 아이콘
        }
    }

    return(
        <section className="py-12 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex overflow-x-auto pb-4 gap-8 no-scrollbar justify-between">                    
                    {categories.map((item)=>(
                        <Link key={item.categoryId}
                        to={`/products?categoryId=${item.categoryId}`}
                        className="flex flex-col items-center gap-3 min-w-[80px] group cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                <span className="material-symbols-outlined text-3xl">{getIconName(item)}</span>
                            </div>
                            <span className="text-sm font-bold">{item.categoryName}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
export default CategoryTabs