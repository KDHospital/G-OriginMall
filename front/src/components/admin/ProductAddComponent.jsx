const ProductAddComponent = () =>{
    return(
        <div className="grid grid-cols-1 gap-4 mb-5">
            <div className="bg-white rounded-md p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-gray-700">상품등록 타이틀</span>
                    <span className="text-xs text-gray-400">서브타이틀</span>
                </div>
                {/* category */}
                <div className="grid grid-cols-6">
                    <div className="text-xs text-gray-400 mb-2">Category</div>
                    <input className="border border-gray-900" type="text" />
                </div>
                {/* seller */}
                <div className="grid grid-cols-6">
                    <div className="text-xs text-gray-400 mb-2">Category</div>
                    <input className="border border-gray-900" type="text" />
                </div>
                {/* Pname */}
                <div className="grid grid-cols-6">
                    <div className="text-xs text-gray-400 mb-2">Category</div>
                    <input className="border border-gray-900" type="text" />
                </div>
                {/* Pdesc */}
                <div className="grid grid-cols-6">
                    <div className="text-xs text-gray-400 mb-2">Category</div>
                    <input className="border border-gray-900" type="text" />
                </div>
                {/* ListPrice */}
                <div className="grid grid-cols-6">
                    <div className="text-xs text-gray-400 mb-2">Category</div>
                    <input className="border border-gray-900" type="text" />
                </div>
                {/* DiscountPrice */}
                <div className="grid grid-cols-6">
                    <div className="text-xs text-gray-400 mb-2">Category</div>
                    <input className="border border-gray-900" type="text" />
                </div>
                {/* Price */}
                <div className="grid grid-cols-6">
                    <div className="text-xs text-gray-400 mb-2">Category</div>
                    <input className="border border-gray-900" type="text" />
                </div>
                {/* Stock */}
                <div className="grid grid-cols-6">
                    <div className="text-xs text-gray-400 mb-2">Category</div>
                    <input className="border border-gray-900" type="text" />
                </div>
                {/* DeliveryFee */}
                <div className="grid grid-cols-6">
                    <div className="text-xs text-gray-400 mb-2">Category</div>
                    <input className="border border-gray-900" type="text" />
                </div>
                {/* Certified */}
                <div className="grid grid-cols-6">
                    <div className="text-xs text-gray-400 mb-2">Category</div>
                    <input className="border border-gray-900" type="text" />
                </div>
            </div>            
        </div>
    )
}
export default ProductAddComponent