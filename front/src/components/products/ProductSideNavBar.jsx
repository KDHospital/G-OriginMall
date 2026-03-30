import { Link } from "react-router-dom"

const ProductSideNavBar = () => {
    return(
        <div className="flex flex-col py-8 pr-4 sticky top-24">
            <h2 className="font-bold text-2xl text-green-900 dark:text-green-400 mb-1">농산물</h2>
            <p className="font-manrope text-xs text-stone-500 mb-8 tracking-wide">로컬 김포 푸드</p>
            <div className="space-y-1">
                <Link to={"/"} className="flex items-center gap-3 px-4 py-3 bg-stone-200/50 dark:bg-stone-800/50 text-green-900 dark:text-amber-500 font-semibold rounded-r-full transition-transform active:opacity-80">
                    <span className="material-symbols-outlined text-xl">grain</span>
                    <span className="font-manrope">사이드메뉴1</span>
                </Link>
                <Link to={"/"} className="flex items-center gap-3 px-4 py-3 text-stone-500 dark:text-stone-400 hover:translate-x-1 transition-transform hover:bg-stone-100 dark:hover:bg-stone-800 rounded-r-full">
                    <span className="material-symbols-outlined text-xl">eco</span>
                    <span className="font-manrope">사이드메뉴2</span>
                </Link>
                <Link to={"/"} className="flex items-center gap-3 px-4 py-3 text-stone-500 dark:text-stone-400 hover:translate-x-1 transition-transform hover:bg-stone-100 dark:hover:bg-stone-800 rounded-r-full">
                    <span className="material-symbols-outlined text-xl">psychology</span>
                    <span className="font-manrope">사이드메뉴3</span>
                </Link>
                <Link to={"/"} className="flex items-center gap-3 px-4 py-3 text-stone-500 dark:text-stone-400 hover:translate-x-1 transition-transform hover:bg-stone-100 dark:hover:bg-stone-800 rounded-r-full">
                    <span className="material-symbols-outlined text-xl">spa</span>
                    <span className="font-manrope">사이드메뉴4</span>
                </Link>
                <Link to={"/"} className="flex items-center gap-3 px-4 py-3 text-stone-500 dark:text-stone-400 hover:translate-x-1 transition-transform hover:bg-stone-100 dark:hover:bg-stone-800 rounded-r-full">
                    <span className="material-symbols-outlined text-xl">tsunami</span>
                    <span className="font-manrope">사이드메뉴5</span>
                </Link>
                <Link to={"/"} className="flex items-center gap-3 px-4 py-3 text-stone-500 dark:text-stone-400 hover:translate-x-1 transition-transform hover:bg-stone-100 dark:hover:bg-stone-800 rounded-r-full">
                    <span className="material-symbols-outlined text-xl">stars</span>
                    <span className="font-manrope">사이드메뉴5</span>
                </Link>
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

    )
}
export default ProductSideNavBar