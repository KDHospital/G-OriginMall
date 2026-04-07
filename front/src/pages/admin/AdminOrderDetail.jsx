import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import axiosInstance from "../../api/axios";
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
};

function StatusBadge({ status, label }) {
    return (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLE[status] ?? "bg-gray-100 text-gray-500"}`}>
            {label}
        </span>
    );
}

// ─────────────────────────────────────────
// 다음 상태 버튼 라벨
// ─────────────────────────────────────────
const NEXT_STATUS_LABEL = {
    0: "상품준비 확인",
    1: "배송 시작",
    2: "배송 완료",
};

export default function AdminOrderDetail() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // 주문 상세 조회
    const fetchOrder = () => {
        axiosInstance.get(`/admin/orders/${orderId}`)
            .then((res) => setOrder(res.data))
            .catch((err) => {
                console.error("주문 상세 조회 실패:", err);
                alert("주문 정보를 불러올 수 없습니다.");
                navigate("/admin/orders");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    // 상태 변경 — 어드민은 판매자 상태변경 API 재사용
    const handleUpdateStatus = () => {
        const nextStatus = order.status + 1;
        const label = NEXT_STATUS_LABEL[order.status];

        if (!window.confirm(`${label} 처리하시겠습니까?`)) return;

        axiosInstance.patch(`/admin/orders/${orderId}/status?status=${nextStatus}`)
            .then(() => {
                alert(`${label} 처리가 완료되었습니다.`);
                fetchOrder();
            })
            .catch((err) => {
                alert(err.response?.data?.message ?? "상태 변경 중 오류가 발생했습니다.");
            });
    };

    // 주문 취소 — 어드민은 상태 제한 없음
    const handleCancelOrder = () => {
        if (!window.confirm("주문을 취소하시겠습니까? 관리자 취소는 되돌릴 수 없습니다.")) return;

        axiosInstance.patch(`/admin/orders/${orderId}/cancel`)
            .then(() => {
                alert("주문이 취소되었습니다.");
                fetchOrder();
            })
            .catch((err) => {
                alert(err.response?.data?.message ?? "취소 처리 중 오류가 발생했습니다.");
            });
    };

    // 부분 취소 
    const handleCancelItem = (orderItemId) => {
        if (!window.confirm("해당 상품을 취소하시겠습니까?")) return;

        axiosInstance.patch(`/admin/orders/${orderId}/items/${orderItemId}/cancel`)
            .then(() => {
                alert("상품이 취소되었습니다.");
                fetchOrder();
            })
            .catch((err) => {
                alert(err.response?.data?.message ?? "취소 처리 중 오류가 발생했습니다.");
            });
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    if (!order) return null;

    // 어드민 — status < 4(취소/환불)면 취소 가능
    const canUpdateStatus = order.status >= 0 && order.status <= 2;
    const canCancel = order.status < 4;

    // 취소되지 않은 아이템만 합산
    const totalItemPrice = order.orderItems
        ?.filter(item => item.status === 0)
        .reduce((sum, item) => sum + item.subtotal, 0) ?? 0;

    // 배송비 = 최종 결제금액 - 정상 상품금액 합계
    const deliveryFee = (order.totalPrice ?? 0) - totalItemPrice;

    return (
        <AdminLayout>
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-700 border-l-4 border-blue-500 pl-3">
                    주문 상세
                </h2>
                <Link
                    to="/admin/orders"
                    className="text-xs text-gray-400 hover:text-gray-700"
                >
                    ← 주문 목록으로
                </Link>
            </div>

            <div className="space-y-5">

                {/* 주문 기본 정보 */}
                <section className="bg-white rounded-md p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">
                                {order.createdAt?.replace("T", " ").slice(0, 16)}
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                                ORDER_{order.orderId}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusBadge status={order.status} label={order.statusLabel} />
                            {/* 상태 변경 버튼 */}
                            {canUpdateStatus && (
                                <button
                                    onClick={handleUpdateStatus}
                                    className="text-xs px-3 py-1.5 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors whitespace-nowrap"
                                >
                                    {NEXT_STATUS_LABEL[order.status]}
                                </button>
                            )}
                            {/* 취소 버튼 — 어드민은 배송완료까지 취소 가능 */}
                            {canCancel && (
                                <button
                                    onClick={handleCancelOrder}
                                    className="text-xs px-3 py-1.5 border border-red-300 text-red-500 rounded hover:bg-red-50 transition-colors whitespace-nowrap"
                                >
                                    주문 취소
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* 주문 상품 목록 */}
                <section className="bg-white rounded-md shadow-sm border border-gray-100">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="text-sm font-bold text-gray-700">주문 상품</h3>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
                                <th className="p-4 text-left font-medium">상품정보</th>
                                <th className="p-4 text-right font-medium">단가</th>
                                <th className="p-4 text-center font-medium">수량</th>
                                <th className="p-4 text-right font-medium">소계</th>
                                <th className="p-4 text-center font-medium">상태</th>
                                {canCancel && (
                                    <th className="p-4 text-center font-medium">관리</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderItems?.map((item) => (
                                <tr key={item.orderItemId} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex-shrink-0 overflow-hidden">
                                                {item.thumbnailImageUrl ? (
                                                    <img
                                                        src={`${BASE_URL}${item.thumbnailImageUrl}`}
                                                        alt={item.productName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">No</div>
                                                )}
                                            </div>
                                            <p className="text-xs font-medium text-gray-800 truncate max-w-[180px]">
                                                {item.productName}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right text-xs text-gray-600 whitespace-nowrap">
                                        {item.price?.toLocaleString("ko-KR")}원
                                    </td>
                                    <td className="p-4 text-center text-xs text-gray-600">
                                        {item.quantity}
                                    </td>
                                    <td className="p-4 text-right text-xs font-medium text-gray-800 whitespace-nowrap">
                                        {item.subtotal?.toLocaleString("ko-KR")}원
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            item.status === 1
                                                ? "bg-red-100 text-red-500"
                                                : "bg-gray-100 text-gray-500"
                                        }`}>
                                            {item.statusLabel}
                                        </span>
                                    </td>
                                    {canCancel && (
                                        <td className="p-4 text-center">
                                            {item.status === 0 ? (
                                                <button
                                                    onClick={() => handleCancelItem(item.orderItemId)}
                                                    className="text-xs px-3 py-1.5 border border-red-300 text-red-500 rounded hover:bg-red-50 transition-colors whitespace-nowrap"
                                                >
                                                    취소
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-300">-</span>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* 결제 금액 요약 */}
                    <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
                        <div className="text-sm space-y-1 text-right">
                            <p className="text-gray-500">
                                상품 금액 <span className="text-gray-800 font-medium ml-4">
                                    {totalItemPrice?.toLocaleString("ko-KR")}원
                                </span>
                            </p>
                            <p className="text-gray-500">
                                배송비 <span className="text-gray-800 font-medium ml-4">
                                    + {deliveryFee > 0 ? deliveryFee?.toLocaleString("ko-KR") : 0}원
                                </span>
                            </p>
                            <p className="text-base font-bold text-gray-900 pt-1 border-t border-gray-100">
                                최종 결제금액 <span className="ml-4">
                                    {order.totalPrice?.toLocaleString("ko-KR")}원
                                </span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* 회원 정보 — 어드민 전용 */}
                <section className="bg-white rounded-md p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">주문자 정보</h3>
                    <table className="w-full text-sm border-t border-gray-100">
                        <tbody>
                            <tr className="border-b border-gray-50">
                                <td className="p-4 w-32 bg-gray-50 font-bold text-gray-600 text-xs">판매자</td>
                                <td className="p-4 text-xs">{order.sellerName}</td>
                            </tr>
                            <tr className="border-b border-gray-50">
                                <td className="p-4 w-32 bg-gray-50 font-bold text-gray-600 text-xs">주문 그룹 ID</td>
                                <td className="p-4 text-xs text-gray-400">{order.orderGroupId}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                {/* 배송지 정보 */}
                <section className="bg-white rounded-md p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">배송지 정보</h3>
                    <table className="w-full text-sm border-t border-gray-100">
                        <tbody>
                            <tr className="border-b border-gray-50">
                                <td className="p-4 w-32 bg-gray-50 font-bold text-gray-600 text-xs">받는 분</td>
                                <td className="p-4 text-xs">{order.receiverName}</td>
                            </tr>
                            <tr className="border-b border-gray-50">
                                <td className="p-4 w-32 bg-gray-50 font-bold text-gray-600 text-xs">연락처</td>
                                <td className="p-4 text-xs">{order.receiverTel}</td>
                            </tr>
                            <tr className="border-b border-gray-50">
                                <td className="p-4 w-32 bg-gray-50 font-bold text-gray-600 text-xs">주소</td>
                                <td className="p-4 text-xs">{order.address} {order.addressDetail}</td>
                            </tr>
                            <tr className="border-b border-gray-50">
                                <td className="p-4 w-32 bg-gray-50 font-bold text-gray-600 text-xs">우편번호</td>
                                <td className="p-4 text-xs">{order.zipcode}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                {/* 결제 정보 */}
                <section className="bg-white rounded-md p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">결제 정보</h3>
                    <table className="w-full text-sm border-t border-gray-100">
                        <tbody>
                            <tr className="border-b border-gray-50">
                                <td className="p-4 w-32 bg-gray-50 font-bold text-gray-600 text-xs">결제 수단</td>
                                <td className="p-4 text-xs">{order.paymentMethod ?? "-"}</td>
                            </tr>
                            <tr className="border-b border-gray-50">
                                <td className="p-4 w-32 bg-gray-50 font-bold text-gray-600 text-xs">결제 일시</td>
                                <td className="p-4 text-xs">{order.paidAt?.replace("T", " ").slice(0, 16) ?? "-"}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        </AdminLayout>
    );
}