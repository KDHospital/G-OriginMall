import { useState, useEffect } from "react"
import { getCategories } from "../../api/productsApi"
import useCustomMove from "../../hooks/useCustomMove"
import { Link } from "react-router-dom"

const ProductNavBar = () => {

    const [categories, setCategories] = useState([])   // 전체 카테고리 트리
    const [parentCategory, setParentCategory] = useState(null) // 현재 1뎁스
    const { moveToCategory, moveToPrice, categoryId } = useCustomMove()
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories()
                setCategories(res.data)
            } catch (err) {
                console.error('카테고리 로드 실패', err)
            }
        }
        fetchCategories()
    }, [])

    // 현재 선택된 categoryId로 1뎁스 찾기
    useEffect(() => {
        if (!categoryId) {
            //카테고리가 없으면 null, 전체상품
            setParentCategory(null)
            return
        }
        if (categories.length === 0) return

        // 선택된 카테고리가 속한 1뎁스 찾기
        const parent = categories.find(cat =>
            cat.children?.some(child => String(child.categoryId) === String(categoryId))
        ) || categories.find(cat => String(cat.categoryId) === String(categoryId))
        setParentCategory(parent || null)
    }, [categoryId, categories])

    return(
        <nav className="flex items-center gap-2 mb-8 text-on-surface-variant font-manrope text-sm">
            {/* Link to 링크 수정 필요 */}
            <Link to={"/"} className="hover:text-primary">홈</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link to={"/"} className="hover:text-primary">상품</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="font-semibold text-primary">{parentCategory?.categoryName || '전체 상품'}</span>
        </nav>
    )
}
export default ProductNavBar