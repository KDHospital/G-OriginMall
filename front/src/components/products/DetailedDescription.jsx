import { useEffect, useState } from "react"
import { getImageUrl } from "../../util/imagesUtil"

const DetailedDescription = ({ product }) => {
    if (!product) return null
    //버튼 제어 상태값 정의
    const [openDesc, setOpenDesc] = useState(false)
    const [textDesc, setTextDesc] = useState(false)
    // imageUrls 배열에서 마지막 이미지 꺼내기
    // imageUrls가 없거나 비어있으면 null (썸네일만 있는 경우)
    const detailImage = product.detailImageUrl ?? null
    const handleOpenDescImg = () => {
        setOpenDesc(true)
    }
    const handleCloseDescImg = () => {
        setOpenDesc(false)
    }

    useEffect(()=>{
        if (detailImage) {
            //이미지가 있는 경우
            setTextDesc(false)
        } else {
            setTextDesc(true)
        }
    })
    
    return (
        <div className="py-16 space-y-24">
            <div className={`${openDesc ? '' : 'max-h-[500px] overflow-hidden' }`}>
                {/* 마지막 이미지 있을 때만 렌더링 */}
                {detailImage && (
                    <img
                        src={getImageUrl(detailImage)}
                        alt={`${product.pname} 상세 설명`}
                        className="w-full rounded-xl"
                    />
                )}

                {/* 이미지 없으면 텍스트 설명만 */}
                {product.pdesc && (
                    <p className="text-on-surface-variant leading-relaxed whitespace-pre-line">
                        {product.pdesc}
                    </p>
                )}
            </div>
            {textDesc ? <></> : 
            <>
                {openDesc ? <button 
                onClick={handleCloseDescImg}
                className="w-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all active:scale-95"
                >상세정보 접기
                    <span class="material-symbols-outlined">arrow_drop_up</span>
                </button> : <button 
                onClick={handleOpenDescImg}
                className="w-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all active:scale-95"
                >상세정보 펼쳐보기
                    <span class="material-symbols-outlined">arrow_drop_down</span>
                </button>}            
            </>
            }
        </div>
    )
}
export default DetailedDescription