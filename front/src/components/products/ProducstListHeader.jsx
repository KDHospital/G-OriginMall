const ProducstListHeader = ({title,desc}) => {
    return(
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
                <h1 className="font-newsreader text-4xl font-bold text-primary mb-2">{title}</h1>
                <p className="font-manrope text-on-surface-variant">{desc} </p>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="font-manrope text-xs font-bold uppercase tracking-tighter text-on-surface-variant">정렬순</span>
                    <select className="bg-surface-container-low border-none rounded-lg font-manrope text-sm focus:ring-2 focus:ring-primary py-2 px-4 cursor-pointer">
                        <option>추천순</option>
                        <option>구매량순</option>
                        <option>낮은 가격순</option>
                        <option>높은 가격순</option>
                    </select>
                </div>
            </div>
        </header>
    )
}
export default ProducstListHeader