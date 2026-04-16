import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import axiosInstance from "../../api/axios";
import MyPageComponent from "../../components/member/MyPageComponent";
import { BASE_URL } from "../../util/imagesUtil";

// ─────────────────────────────────────────
// 상태 배지
// ─────────────────────────────────────────
const STATUS_STYLE = {
    0: "bg-gray-100 text-gray-500",
    1: "bg-blue-100 text-blue-600",
    2: "bg-yellow-100 text-yellow-600",
    3: "bg-green-100 text-green-600",
    4: "bg-red-100 text-red-500",
    5: "bg-orange-100 text-orange-500",
};

function StatusBadge({ status, label }) {
    return (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLE[status] ?? "bg-gray-100 text-gray-500"}`}>
            {label}
        </span>
    );
}

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [memberInfo, setMemberInfo] = useState(null)

    const PAGE_SIZE = 10;

    useEffect(() => {
       
        const savedMember = localStorage.getItem("member");
        if (savedMember) {
            setMemberInfo(JSON.parse(savedMember));
        }

        setLoading(true);
        axiosInstance.get(`/orders?page=${currentPage}&size=${PAGE_SIZE}`)
            .then((res) => {
                setOrders(res.data.content);
                setTotalPages(res.data.totalPages);
                setTotalElements(res.data.totalElements);
            })
            .catch((err) => console.error("주문 내역 로드 실패:", err))
            .finally(() => setLoading(false));
  
    }, [currentPage]);

    return (
        <BasicLayout>
            <div className="max-w-7xl mx-auto flex gap-8 p-10 bg-gray-50 min-h-screen">

                {/* 사이드바 */}
                {memberInfo && <MyPageComponent member={memberInfo} />}

                {/* 메인 컨텐츠 */}
                <main className="flex-grow space-y-6">
                    <h2 className="text-2xl font-bold border-l-4 border-green-600 pl-3">주문 내역</h2>
                    <p className="text-sm text-gray-400">전체 {totalElements}건</p>

                    <section className="bg-white border border-gray-200 shadow-sm rounded-md">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-20 text-sm text-gray-400">
                                주문 내역이 없습니다.
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
                                        <th className="p-4 text-left font-medium">주문일</th>
                                        <th className="p-4 text-left font-medium">주문번호</th>
                                        <th className="p-4 text-left font-medium">상품정보</th>
                                        <th className="p-4 text-right font-medium">결제금액</th>
                                        <th className="p-4 text-center font-medium">상태</th>
                                        <th className="p-4 text-center font-medium">관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.orderId} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                                                {order.createdAt?.replace("T", " ").slice(0, 16)}
                                            </td>
                                            <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                                                ORDER_{order.orderId}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex-shrink-0 overflow-hidden">
                                                        
                                                        {order.orderItems?.[0]?.thumbnailImageUrl ? (
                                                            <img
                                                                src={`${BASE_URL}${order.orderItems[0].thumbnailImageUrl}`}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">No</div>
                                                        )}

                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800 truncate max-w-[200px]">
                                                            {order.orderItems?.[0]?.productName}
                                                            {order.orderItems?.length > 1 && (
                                                                <span className="text-gray-400 text-xs"> 외 {order.orderItems.length - 1}건</span>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-gray-400">수량 {order.orderItems?.[0]?.quantity}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right font-medium text-gray-800 whitespace-nowrap">
                                                {order.totalPrice?.toLocaleString("ko-KR")}원
                                            </td>
                                            <td className="p-4 text-center">
                                                <StatusBadge status={order.status} label={order.statusLabel} />
                                            </td>
                                            <td className="p-4 text-center">
                                                <Link
                                                    to={`/orders/${order.orderId}`}
                                                    className="text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors whitespace-nowrap"
                                                >
                                                    상세보기
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>

                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-1">
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
                                            ? "bg-gray-800 text-white border-gray-800"
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
                </main>
            </div>
        </BasicLayout>
    );
}