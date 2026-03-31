import useCustomMove from "../../hooks/useCustomMove"
const ProductSortSelect = () => {
    const {sort,moveToSort} = useCustomMove()
    const handleChange = (e) => {
        moveToSort(e.target.value)
    }
    return(
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <span className="font-manrope text-xs font-bold uppercase tracking-tighter text-on-surface-variant">정렬순</span>
                <select 
                value={sort} 
                onChange={handleChange}
                className="bg-surface-container-low border-none rounded-lg font-manrope text-sm focus:ring-2 focus:ring-primary py-2 px-4 cursor-pointer">
                    <option value="latest">추천순</option>
                    <option value="priceLow">낮은 가격순</option>
                    <option value="priceHigh">높은 가격순</option>
                </select>
            </div>
        </div>        
    )
}
export default ProductSortSelect