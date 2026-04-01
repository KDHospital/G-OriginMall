const ProductDetailTabs = ({ activeTab, onTabChange }) => {
    const tabs = [
        { key: 'info',   label: '상품 정보' },
        { key: 'seller', label: '판매자 정보' },
    ]

    return (
        <div className="flex border-b border-outline-variant overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
                <button
                    key={tab.key}
                    onClick={() => onTabChange(tab.key)}
                    className={`px-8 py-4 border-b-2 font-bold whitespace-nowrap transition-colors
                        ${activeTab === tab.key
                            ? 'border-primary text-primary'
                            : 'border-transparent text-on-surface-variant hover:text-primary'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}
export default ProductDetailTabs