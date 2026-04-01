import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCategories } from '../../api/productsApi' 
import useCustomMove from '../../hooks/useCustomMove'

const ProductSideNavBar = () => {
    const [categories, setCategories] = useState([])   // 전체 카테고리 트리
    const [parentCategory, setParentCategory] = useState(null) // 현재 1뎁스
    const [priceValue, setPriceValue] = useState(200000)

    const { moveToCategory, moveToPrice, categoryId } = useCustomMove()
    const [searchParams] = useSearchParams()

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
            //카테고리가 없으면 null,전체 상품
            setParentCategory(null)
            return
        }
        if (categories.length===0) return

        // 선택된 카테고리가 속한 1뎁스 찾기
        const parent = categories.find(cat =>
            cat.children?.some(child => String(child.categoryId) === String(categoryId))
        ) || categories.find(cat => String(cat.categoryId) === String(categoryId))
        setParentCategory(parent || null)
    }, [categoryId, categories])

    // 슬라이더 조작 끝났을 때만 API 요청 (드래그 중엔 요청 안 보냄)
    const handlePriceChange = (e) => {
        setPriceValue(Number(e.target.value))
    }
    const handlePriceCommit = (e) => {
        moveToPrice(0, Number(e.target.value))
    }

    // 아이콘 매핑 (카테고리명 또는 순서로 아이콘 지정)
    const iconMap = ['grain', 'eco', 'psychology', 'spa', 'tsunami', 'stars']

    const children = parentCategory?.children || []

    return (
        <div className="flex flex-col py-8 pr-4 sticky top-24">
            {/* 1뎁스 카테고리명 */}
            <h2 className="font-bold text-2xl text-green-900 dark:text-green-400 mb-1">
                {parentCategory?.categoryName || '전체 상품'}
            </h2>
            <p className="font-manrope text-xs text-stone-500 mb-8 tracking-wide">로컬 김포 푸드</p>

            {/* 2뎁스 카테고리 목록 */}
            <div className="space-y-1">
                {children.map((child, index) => {
                    const isActive = String(child.categoryId) === String(categoryId)
                    return (
                        <button
                            key={child.categoryId}
                            onClick={() => moveToCategory(child.categoryId)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-r-full transition-all text-left
                                ${isActive
                                    ? 'bg-stone-200/50 dark:bg-stone-800/50 text-green-900 dark:text-amber-500 font-semibold'
                                    : 'text-stone-500 dark:text-stone-400 hover:translate-x-1 hover:bg-stone-100 dark:hover:bg-stone-800'
                                }`}
                        >
                            <span className="material-symbols-outlined text-xl">
                                {iconMap[index] || 'category'}
                            </span>
                            <span className="font-manrope">{child.categoryName}</span>
                        </button>
                    )
                })}
            </div>

            {/* 가격 필터 */}
            <div className="mt-12 pt-8 border-t border-outline-variant/20">
                <h3 className="font-manrope text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6">
                    가격 필터
                </h3>
                <div className="space-y-4">
                    <input
                        className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                        max="200000"
                        min="0"
                        step="1000"
                        type="range"
                        value={priceValue}
                        onChange={handlePriceChange}
                        onMouseUp={handlePriceCommit}   // 드래그 끝날 때 요청
                        onTouchEnd={handlePriceCommit}  // 모바일 터치 끝날 때 요청
                    />
                    <div className="flex justify-between font-manrope text-sm text-on-surface">
                        <span>0원</span>
                        <span>{priceValue.toLocaleString()}{priceValue >= 200000 ? '+' : ''}원</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductSideNavBar
