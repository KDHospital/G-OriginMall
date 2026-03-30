import SellerLayout from "../../layouts/SellerLayout";

// 추후 실제 데이터로 교체 예정
const DUMMY_STATS = [
    { label: '오늘 주문', value: '-', unit: '건', sub: '어제 대비 -' },
    { label: '오늘 매출', value: '-', unit: '원', sub: '어제 대비 -' },
    { label: '판매 중 상품', value: '-', unit: '개', sub: '품절 -개' },
    { label: '미처리 주문', value: '-', unit: '건', sub: '처리 필요' },
];

function SellerDashboardPage() {
    return (
        <SellerLayout>

            {/* 페이지 타이틀 */}
            <h2 className="text-lg font-bold text-gray-700 border-l-4 border-green-500 pl-3 mb-5">
                대시보드
            </h2>

            {/* 통계 카드 4개 */}
            <div className="grid grid-cols-4 gap-4 mb-5">
                {DUMMY_STATS.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-md p-4 shadow-sm border-t-4 border-green-500">
                        <div className="text-xs text-gray-400 mb-2">{stat.label}</div>
                        <div className="text-3xl font-bold text-gray-700">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.unit}</div>
                        <div className="text-xs text-gray-400 mt-2">{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* 차트 영역 */}
            <div className="grid grid-cols-2 gap-4 mb-5">

                {/* 최근 7일 매출 */}
                <div className="bg-white rounded-md p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-gray-700">최근 7일 매출</span>
                        <span className="text-xs text-gray-400">단위 : 원 | 금일 | Chart.js</span>
                    </div>
                    <div className="h-40 bg-gray-50 rounded flex items-center justify-center text-gray-400 text-sm">
                        📊 매출 통계 차트 (후순위 구현 예정)
                    </div>
                </div>

                {/* 주문 상태 현황 */}
                <div className="bg-white rounded-md p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-gray-700">주문 상태 현황</span>
                        <span className="text-xs text-gray-400">전체 수량 기준</span>
                    </div>
                    <div className="h-40 bg-gray-50 rounded flex items-center justify-center text-gray-400 text-sm">
                        📦 주문 상태 차트 (후순위 구현 예정)
                    </div>
                </div>
            </div>

            {/* 최근 주문 & 내 상품 현황 */}
            <div className="grid grid-cols-2 gap-4">

                {/* 최근 주문 5건 */}
                <div className="bg-white rounded-md p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-gray-700">최근 주문 5건</span>
                        <button className="text-xs text-green-500 border border-green-500 rounded px-2 py-0.5 hover:bg-green-50">
                            전체보기
                        </button>
                    </div>
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left text-gray-400 font-normal pb-2">주문번호</th>
                                <th className="text-left text-gray-400 font-normal pb-2">주문자</th>
                                <th className="text-left text-gray-400 font-normal pb-2">금액</th>
                                <th className="text-left text-gray-400 font-normal pb-2">상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={4} className="text-center text-gray-400 py-8">
                                    데이터 없음
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 내 상품 현황 */}
                <div className="bg-white rounded-md p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-gray-700">내 상품 현황</span>
                        <button className="text-xs text-green-500 border border-green-500 rounded px-2 py-0.5 hover:bg-green-50">
                            전체보기
                        </button>
                    </div>
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left text-gray-400 font-normal pb-2">상품명</th>
                                <th className="text-left text-gray-400 font-normal pb-2">가격</th>
                                <th className="text-left text-gray-400 font-normal pb-2">재고</th>
                                <th className="text-left text-gray-400 font-normal pb-2">상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={4} className="text-center text-gray-400 py-8">
                                    데이터 없음
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </SellerLayout>
    );
}

export default SellerDashboardPage;
