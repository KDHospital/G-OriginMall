import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import axiosInstance from "../../api/axios";

// ─────────────────────────────────────────
// 상태 배지
// ─────────────────────────────────────────
const STATUS_STYLE = {
    0: "bg-gray-100 text-gray-500",
    1: "bg-blue-100 text-blue-600",
    2: "bg-yellow-100 text-yellow-600",
    3: "bg-green-100 text-green-600",
    4: "bg-red-100 text-red-500",
};

function StatusBadge({ status, label }) {
    return (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLE[status] ?? "bg-gray-100 text-gray-500"}`}>
            {label}
        </span>
    );
}

function AdminDashboardPage() {
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get("/admin/dashboard")
            .then((res) => setDashboard(res.data))
            .catch((err) => console.error("대시보드 로드 실패:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    const stats = [
        { label: "오늘 주문", value: dashboard?.todayOrders ?? 0, unit: "건", sub: "오늘 기준" },
        { label: "오늘 매출", value: dashboard?.todayRevenue?.toLocaleString("ko-KR") ?? 0, unit: "원", sub: "취소 제외" },
        { label: "전체 회원", value: dashboard?.totalMembers ?? 0, unit: "명", sub: "탈퇴 제외" },
        { label: "판매 중 상품", value: dashboard?.activeProducts ?? 0, unit: "개", sub: `품절 ${dashboard?.soldOutProducts ?? 0}개` },
    ];

    return (
        <AdminLayout>
            {/* 페이지 타이틀 */}
            <h2 className="text-lg font-bold text-gray-700 border-l-4 border-blue-500 pl-3 mb-5">
                대시보드
            </h2>

            {/* 통계 카드 4개 */}
            <div className="grid grid-cols-4 gap-4 mb-5">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-md p-4 shadow-sm border-t-4 border-blue-500">
                        <div className="text-xs text-gray-400 mb-2">{stat.label}</div>
                        <div className="text-3xl font-bold text-gray-700">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.unit}</div>
                        <div className="text-xs text-gray-400 mt-2">{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* 차트 영역 — 후순위 */}
            <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-white rounded-md p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-gray-700">최근 7일 매출</span>
                        <span className="text-xs text-gray-400">Chart.js 후순위</span>
                    </div>
                    <div className="h-40 bg-gray-50 rounded flex items-center justify-center text-gray-400 text-sm">
                        📊 매출 통계 차트 (후순위 구현 예정)
                    </div>
                </div>
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

            {/* 최근 주문 & 최근 가입 회원 */}
            <div className="grid grid-cols-2 gap-4">

                {/* 최근 주문 5건 */}
                <div className="bg-white rounded-md p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-gray-700">최근 주문 5건</span>
                        <button
                            onClick={() => navigate("/admin/orders")}
                            className="text-xs text-blue-500 border border-blue-500 rounded px-2 py-0.5 hover:bg-blue-50"
                        >
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
                            {dashboard?.recentOrders?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center text-gray-400 py-8">
                                        데이터 없음
                                    </td>
                                </tr>
                            ) : (
                                dashboard?.recentOrders?.map((order) => (
                                    <tr
                                        key={order.orderId}
                                        onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                                        className="border-t border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="py-2 text-gray-500">ORDER_{order.orderId}</td>
                                        <td className="py-2 text-gray-600">{order.receiverName}</td>
                                        <td className="py-2 text-gray-800 font-medium whitespace-nowrap">
                                            {order.totalPrice?.toLocaleString("ko-KR")}원
                                        </td>
                                        <td className="py-2">
                                            <StatusBadge status={order.status} label={order.statusLabel} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 최근 가입 회원 */}
                <div className="bg-white rounded-md p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-gray-700">최근 가입 회원</span>
                        <button
                            onClick={() => navigate("/admin/members")}
                            className="text-xs text-blue-500 border border-blue-500 rounded px-2 py-0.5 hover:bg-blue-50"
                        >
                            전체보기
                        </button>
                    </div>
                    {dashboard?.recentMembers?.length === 0 ? (
                        <div className="flex items-center justify-center h-28 text-gray-400 text-sm">
                            데이터 없음
                        </div>
                    ) : (
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left text-gray-400 font-normal pb-2">이름</th>
                                    <th className="text-left text-gray-400 font-normal pb-2">아이디</th>
                                    <th className="text-left text-gray-400 font-normal pb-2">가입일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboard?.recentMembers?.map((member) => (
                                    <tr
                                        key={member.memberId}
                                        onClick={() => navigate(`/admin/members/${member.memberId}`)}
                                        className="border-t border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="py-2 text-gray-800 font-medium">{member.mname}</td>
                                        <td className="py-2 text-gray-500">{member.loginId}</td>
                                        <td className="py-2 text-gray-400 whitespace-nowrap">{member.createdAt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminDashboardPage;