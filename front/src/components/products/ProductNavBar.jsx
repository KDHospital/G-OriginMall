import { Link } from "react-router-dom"

const ProductNavBar = () => {
    return(
        <nav className="flex items-center gap-2 mb-8 text-on-surface-variant font-manrope text-sm">
            {/* Link to 링크 수정 필요 */}
            <Link to={"/"} className="hover:text-primary">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link to={"/"} className="hover:text-primary">Shop</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="font-semibold text-primary">Grains</span>
        </nav>
    )
}
export default ProductNavBar