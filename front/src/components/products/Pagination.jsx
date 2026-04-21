const Pagination = ({serverData, movePage}) => {
    if (!serverData || !serverData.pageNumList) {
        return null
    }
    console.log(serverData)
    return(
        <div className="mt-20 flex justify-center gap-2 font-manrope">
            {/* 이전버튼 */}
            {serverData.prev ? <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-low transition-colors"
            onClick={()=>movePage({page:serverData.prevPage})}>
                <span className="material-symbols-outlined">chevron_left</span>
            </button> : <></> }
            {/* page 수 */}
            {serverData.pageNumList.map(pageNum => 
            <button key={pageNum} 
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${serverData.current === pageNum ? 'bg-surface-container-highest text-primary font-bold' : 'hover:bg-surface-container-low transition-colors'}`} 
            onClick={()=>movePage({page:pageNum})}>{pageNum}</button>
            )}
            {/* next btn */}
            {serverData.next ? <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-low transition-colors"
            onClick={()=>movePage({page:serverData.nextPage})}>
                <span className="material-symbols-outlined">chevron_right</span>
            </button> : <></>}
        </div>
    )
}
export default Pagination