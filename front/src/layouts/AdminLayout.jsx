import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuGroups = [
    {
        label: 'OVERVIEW',
        items: [
            { path: '/admin', label: '대시보드', icon: '📊' },
        ],
    },
    {
        label: 'MANAGEMENT',
        items: [
            { path: '/admin/members', label: '회원 목록', icon: '👤' },
            { path: '/admin/products', label: '상품 목록', icon: '🛍️' },
            { path: '/admin/products/new', label: '상품 등록', icon: '➕' },
            { path: '/admin/orders', label: '주문 목록', icon: '📦' },
        ],
    },
    {
        label: 'CONTENTS',
        items: [
            { path: '/admin/board', label: '게시판 관리', icon: '📋' },
            { path: '/admin/banner', label: '배너 관리', icon: '🖼️' },
        ],
    },
    {
        label: 'STATISTICS',
        items: [
            { path: '/admin/stats/sales', label: '매출 통계 (후순위)', icon: '📈', disabled: true },
            { path: '/admin/stats/orders', label: '주문 통계 (후순위)', icon: '📉', disabled: true },
        ],
    },
];

function AdminLayout({ children }) {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 text-sm">

            {/* 상단 헤더 */}
            <header className="flex justify-between items-center bg-gray-900 text-gray-400 px-5 py-2 text-xs">
                <span>G-Origin Mall / Admin Page</span>
                <span>Admin only</span>
            </header>

            <div className="flex flex-1">

                {/* 사이드바 */}
                <aside className={`bg-gray-900 text-gray-300 flex flex-col transition-all duration-200 ${collapsed ? 'w-16' : 'w-52'}`}>

                    {/* 로고 */}
                    <div className="flex justify-between items-start px-4 py-5 border-b border-gray-700 mb-2">
                        {!collapsed && (
                            <div>
                                <Link to="/"><div className="text-white font-bold text-base">G-Origin Mall</div></Link>
                                <div className="text-gray-500 text-xs mt-1">ADMIN PANEL</div>
                            </div>
                        )}
                        <button
                            className="text-gray-500 hover:text-white text-xs ml-auto"
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            {collapsed ? '▶' : '◀'}
                        </button>
                    </div>

                    {/* 메뉴 */}
                    <nav className="flex-1">
                        {menuGroups.map((group) => (
                            <div key={group.label} className="mb-2">
                                {!collapsed && (
                                    <div className="text-gray-600 text-xs px-4 py-1 tracking-widest">
                                        {group.label}
                                    </div>
                                )}
                                {group.items.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.disabled ? '#' : item.path}
                                        className={`
                                            flex items-center gap-2 px-4 py-2 text-sm border-l-4 transition-all
                                            ${location.pathname === item.path
                                                ? 'bg-gray-700 text-white border-blue-500'
                                                : 'text-gray-400 border-transparent hover:bg-gray-800 hover:text-white'}
                                            ${item.disabled ? 'opacity-40 pointer-events-none' : ''}
                                        `}
                                    >
                                        <span>{item.icon}</span>
                                        {!collapsed && <span>{item.label}</span>}
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </nav>

                    {/* 하단 */}
                    {!collapsed && (
                        <div className="px-4 py-4 border-t border-gray-700 text-xs text-gray-500">
                            <div>관리자 · ADMIN</div>
                            <div className="mt-1 hover:text-white cursor-pointer">로그아웃</div>
                        </div>
                    )}
                </aside>

                {/* 메인 콘텐츠 */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* 푸터 */}
            <footer className="bg-gray-900 text-gray-600 text-center text-xs py-3">
                © 2026 G-Origin Mall ADMIN PAGE · v1.0.0
            </footer>
        </div>
    );
}

export default AdminLayout;
