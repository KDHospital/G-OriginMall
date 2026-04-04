import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SellerLayout from "../../layouts/SellerLayout";
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

// ─────────────────────────────────────────
// 탭 목록
// ─────────────────────────────────────────
const TABS = [
    { label: "전체", status: null },
    { label: "결제전", status: 0 },
    { label: "상품준비중", status: 1 },
    { label: "배송중", status: 2 },
    { label: "배송완료", status: 3 },
    { label: "취소/환불", status: 4 },
];

// ─────────────────────────────────────────
// SellerOrders
// ─────────────────────────────────────────
export default function SellerOrders() {
    const [orders, setOrders] = useState([]);
    const [counts, setCounts] = useState({});
    const [activeTab, setActiveTab] = useState(null); // null = 전체
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);

    const PAGE_SIZE = 10;

    // 카운트 조회
    useEffect(() => {
        axiosInstance.get("/seller/orders/count")
            .then((res) => setCounts(res.data))
            .catch((err) => console.error("카운트 로드 실패:", err));
    }, []);

    // 주문 목록 조회
    useEffect(() => {
        setLoading(true);
        const statusParam = activeTab !== null ? `&status=${activeTab}` : "";
        axiosInstance.get(`/seller/orders?page=${currentPage}&size=${PAGE_SIZE}${statusParam}`)
            .then((res) => {
                setOrders(res.data.content);
                setTotalPages(res.data.totalPages);
                setTotalElements(res.data.totalElements);
            })
            .catch((err) => console.error("주문 목록 로드 실패:", err))
            .finally(() => setLoading(false));
    }, [activeTab, currentPage]);

    // 탭 변경
    const handleTabChange = (status) => {
        setActiveTab(status);
        setCurrentPage(0); // 탭 변경 시 첫 페이지로
    };

    return (
        <SellerLayout>
            {/* 헤더 */}
            <h2 className="text-lg font-bold text-gray-700 border-l-4 border-green-500 pl-3 mb-5">
                주문 관리
            </h2>

            {/* 상태별 탭 */}
            <div className="flex gap-2 mb-5 flex-wrap">
                {TABS.map((tab) => {
                    const count = tab.status === null
                        ? counts.total
                        : counts[`status${tab.status}`];
                    return (
                        <button
                            key={tab.label}
                            onClick={() => handleTabChange(tab.status)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === tab.status
                                    ? "bg-green-700 text-white"
                                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            {tab.label}
                            <span className={`ml-1.5 text-xs ${
                                activeTab === tab.status ? "text-green-200" : "text-gray-400"
                            }`}>
                                {count ?? 0}
                            </span>
                        </button>
                    );
                })}
            </div>

            <p className="text-xs text-gray-400 mb-3">전체 {totalElements}건</p>

            {/* 주문 목록 */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 text-sm text-gray-400">
                        주문 내역이 없습니다.
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
                                <th className="p-4 text-left font-medium">주문번호</th>
                                <th className="p-4 text-left font-medium">주문자</th>
                                <th className="p-4 text-left font-medium">주문상품</th>
                                <th className="p-4 text-right font-medium">결제금액</th>
                                <th className="p-4 text-center font-medium">상태</th>
                                <th className="p-4 text-center font-medium">주문일시</th>
                                <th className="p-4 text-center font-medium">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, idx) => (
                                <tr key={order.orderId} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                                    {/* 주문번호 */}
                                    <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                                        ORDER_{order.orderId}
                                    </td>
                                    {/* 주문자 */}
                                    <td className="p-4 text-xs text-gray-600 whitespace-nowrap">
                                        {order.receiverName}
                                    </td>
                                    {/* 주문상품 */}
                                    <td className="p-4">
                                        <p className="text-xs font-medium text-gray-800 truncate max-w-[180px]">
                                            {order.orderItems?.[0]?.productName}
                                            {order.orderItems?.length > 1 && (
                                                <span className="text-gray-400"> 외 {order.orderItems.length - 1}건</span>
                                            )}
                                        </p>
                                    </td>
                                    {/* 결제금액 */}
                                    <td className="p-4 text-right font-medium text-gray-800 whitespace-nowrap">
                                        {order.totalPrice?.toLocaleString("ko-KR")}원
                                    </td>
                                    {/* 상태 */}
                                    <td className="p-4 text-center">
                                        <StatusBadge status={order.status} label={order.statusLabel} />
                                    </td>
                                    {/* 주문일시 */}
                                    <td className="p-4 text-center text-xs text-gray-400 whitespace-nowrap">
                                        {order.createdAt?.replace("T", " ").slice(0, 16)}
                                    </td>
                                    {/* 관리 */}
                                    <td className="p-4 text-center">
                                        <Link
                                            to={`/seller/orders/${order.orderId}`}
                                            className="text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors whitespace-nowrap"
                                        >
                                            상세
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-6">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                        className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        이전
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`px-3 py-1.5 text-xs border rounded transition-colors ${
                                currentPage === i
                                    ? "bg-green-700 text-white border-green-700"
                                    : "border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        다음
                    </button>
                </div>
            )}
        </SellerLayout>
    );
}