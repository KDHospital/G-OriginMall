const Pagination = () => {
    return(
        <div className="mt-20 flex justify-center gap-2 font-manrope">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-highest text-primary font-bold">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-low transition-colors">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-low transition-colors">3</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
            </button>
        </div>
    )
}
export default Pagination