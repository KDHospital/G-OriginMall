import { useState, useEffect } from "react"
import { getProducts } from "../../api/productApi"
import BasicLayout from "../../layouts/BasicLayout"
import { Link } from "react-router-dom"

const ProductListPage = () => {

    const [product,setProduct] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(()=>{

    })
    return(
        <BasicLayout>
            <div className="pt-24 pb-16 max-w-screen-2xl mx-auto px-6">
                {/* navigation bar */}
                
                <nav className="flex items-center gap-2 mb-8 text-on-surface-variant font-manrope text-sm">
                <a className="hover:text-primary" href="#">Home</a>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <a className="hover:text-primary" href="#">Shop</a>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="font-semibold text-primary">Grains</span>
                </nav>
                
                <div className="flex flex-col md:flex-row gap-12">
                {/* side nav bar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="flex flex-col py-8 pr-4 sticky top-24">
                            <h2 className="font-newsreader text-2xl text-green-900 dark:text-green-400 mb-1">Categories</h2>
                            <p className="font-manrope text-xs text-stone-500 mb-8 tracking-wide">Local Gimpo Produce</p>
                            <div className="space-y-1">
                                <a className="flex items-center gap-3 px-4 py-3 bg-stone-200/50 dark:bg-stone-800/50 text-green-900 dark:text-amber-500 font-semibold rounded-r-full transition-transform active:opacity-80" href="#">
                                    <span className="material-symbols-outlined text-xl">grain</span>
                                    <span className="font-manrope">Grains</span>
                                </a>
                                <a className="flex items-center gap-3 px-4 py-3 text-stone-500 dark:text-stone-400 hover:translate-x-1 transition-transform hover:bg-stone-100 dark:hover:bg-stone-800 rounded-r-full" href="#">
                                    <span className="material-symbols-outlined text-xl">eco</span>
                                    <span className="font-manrope">Fruits</span>
                                </a>
                                <a className="flex items-center gap-3 px-4 py-3 text-stone-500 dark:text-stone-400 hover:translate-x-1 transition-transform hover:bg-stone-100 dark:hover:bg-stone-800 rounded-r-full" href="#">
                                    <span className="material-symbols-outlined text-xl">psychology</span>
                                    <span className="font-manrope">Vegetables</span>
                                </a>
                                <a className="flex items-center gap-3 px-4 py-3 text-stone-500 dark:text-stone-400 hover:translate-x-1 transition-transform hover:bg-stone-100 dark:hover:bg-stone-800 rounded-r-full" href="#">
                                    <span className="material-symbols-outlined text-xl">spa</span>
                                    <span className="font-manrope">Ginseng</span>
                                </a>
                                <a className="flex items-center gap-3 px-4 py-3 text-stone-500 dark:text-stone-400 hover:translate-x-1 transition-transform hover:bg-stone-100 dark:hover:bg-stone-800 rounded-r-full" href="#">
                                    <span className="material-symbols-outlined text-xl">tsunami</span>
                                    <span className="font-manrope">Seafood</span>
                                </a>
                                <a className="flex items-center gap-3 px-4 py-3 text-stone-500 dark:text-stone-400 hover:translate-x-1 transition-transform hover:bg-stone-100 dark:hover:bg-stone-800 rounded-r-full" href="#">
                                    <span className="material-symbols-outlined text-xl">stars</span>
                                    <span className="font-manrope">Specialties</span>
                                </a>
                            </div>
                            <div className="mt-12 pt-8 border-t border-outline-variant/20">
                                <h3 className="font-manrope text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6">Price Range</h3>
                                <div className="space-y-4">
                                    <input className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" max="200000" min="0" step="1000" type="range" />
                                    <div className="flex justify-between font-manrope text-sm text-on-surface">
                                        <span>₩0</span>
                                        <span>₩200,000+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    
                </div>
            </div>
                
        


        </BasicLayout>
    )

}

export default ProductListPage