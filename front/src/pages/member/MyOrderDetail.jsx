import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import axiosInstance from "../../api/axios";
import MyPageComponent from "../../components/member/MyPageComponent";
import { BASE_URL } from "../../util/imagesUtil";
import { formatPhone } from "../../util/phoneUtil";
import { getMemberInfo } from "../../api/memberApi";

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

// ─────────────────────────────────────────
// 배송 타임라인
// ─────────────────────────────────────────
const TIMELINE_STEPS = [
    { status: 1, label: "상품준비중" },
    { status: 2, label: "배송중" },
    { status: 3, label: "배송완료" },
];

function OrderTimeline({ order, history }) {
    if (order.status === 0 || order.status === 4 || order.status === 5) return null;

    const getStepTime = (status) => {
        const found = history.find((h) => h.toStatus === status);
        return found ? found.createdAt?.replace("T", " ").slice(0, 16) : null;
    };

    return (
        <div className="flex items-start justify-center gap-0 py-4">
            {TIMELINE_STEPS.map((step, idx) => {
                const isDone = order.status >= step.status;
                const isCurrent = order.status === step.status;
                const time = getStepTime(step.status);

                return (
                    <div key={step.status} className="flex items-center">
                        {/* 스텝 */}
                        <div className="flex flex-col items-center w-32">
                            {/* 원 */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                isDone
                                    ? "bg-gray-800 border-gray-800 text-white"
                                    : "bg-white border-gray-300 text-gray-300"
                            }`}>
                                {isDone ? "✓" : <span className="text-xs">{idx + 1}</span>}
                            </div>
                            {/* 라벨 */}
                            <p className={`text-xs mt-1 font-medium whitespace-nowrap ${
                                isCurrent ? "text-gray-800 font-bold" : isDone ? "text-gray-600" : "text-gray-300"
                            }`}>
                                {step.label}
                            </p>
                            {/* 시간 */}
                            <p className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">
                                {time ?? "-"}
                            </p>
                        </div>
                        {/* 연결선 */}
                        {idx < TIMELINE_STEPS.length - 1 && (
                            <div className={`h-px w-16 mb-6 ${
                                order.status > step.status ? "bg-gray-800" : "bg-gray-200"
                            }`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function StatusBadge({ status, label }) {
    return (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLE[status] ?? "bg-gray-100 text-gray-500"}`}>
            {label}
        </span>
    );
}

export default function MyOrderDetail() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [member, setMember] = useState(null);
    

    // 주문 상세 조회
    const fetchOrder = () => {
        axiosInstance.get(`/orders/${orderId}`)
            .then((res) => setOrder(res.data))
            .catch((err) => {
                console.error("주문 상세 조회 실패:", err);
                alert("주문 정보를 불러올 수 없습니다.");
                navigate("/orders");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    // 주문 (배송) 상태 표기
    const fetchHistory = () => {
        axiosInstance.get(`/orders/${orderId}/history`)
            .then((res) => setHistory(res.data))
            .catch((err) => console.error("이력 조회 실패:", err));
    };

    useEffect(() => {
        fetchOrder();
        fetchHistory();
    }, [orderId]);

    // 주문 전체 취소
    const handleCancelOrder = () => {
        if (!window.confirm("주문 전체를 취소하시겠습니까?")) return;

        axiosInstance.patch(`/orders/${orderId}/cancel`)
            .then(() => {
                alert("주문이 취소되었습니다.");
                fetchOrder(); // 상태 갱신
            })
            .catch((err) => {
                alert(err.response?.data?.message ?? "취소 처리 중 오류가 발생했습니다.");
            });
    };

    useEffect(() => {
           const savedMember = localStorage.getItem("member");
                if (!savedMember) {
                    alert("로그인이 필요한 서비스입니다.");
                    navigate("/login");
                    return;
                }
        
                // 회원 정보
                getMemberInfo()
                    .then((res) => {
                        setMember(res.data);
                    })
                    .catch((err) => {
                        console.error("내 정보 불러오기 실패:", err);
                        alert("세션이 만료되었거나 정보를 가져올 수 없습니다. 다시 로그인해주세요.");
                        localStorage.removeItem("member");
                        navigate("/login");
                    })
                    .finally(() =>{
                        setLoading(false)
                    });
    }, [navigate]);
    const [cancelling, setCancelling] = useState(false);

    // 개별 아이템 취소
    const handleCancelItem = (orderItemId) => {
        if (cancelling) return;  // 중복 클릭 방지
        if (!window.confirm("해당 상품을 취소하시겠습니까?")) return;

        setCancelling(true);
        axiosInstance.patch(`/orders/${orderId}/items/${orderItemId}/cancel`)
            .then(() => {
                alert("상품이 취소되었습니다.");
                fetchOrder();
            })
            .catch((err) => {
                alert(err.response?.data?.message ?? "취소 처리 중 오류가 발생했습니다.");
            })
            .finally(() => setCancelling(false));
    };

    if (loading) {
        return (
            <BasicLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
                </div>
            </BasicLayout>
        );
    }

    if (!order) return null;

    const canCancel = order.status < 2 && order.status !== 5;

    // 취소되지 않은 아이템만 합산
    const totalItemPrice = order.orderItems
        ?.filter(item => item.status === 0)
        .reduce((sum, item) => sum + item.subtotal, 0) ?? 0;

    // 배송비 = 최종 결제금액 - 정상 상품금액 합계
    const deliveryFee = (order.totalPrice ?? 0) - totalItemPrice;

    return (
        <BasicLayout>
            <div className="max-w-7xl mx-auto flex gap-8 p-10 bg-gray-50 min-h-screen">

                {/* 사이드바 */}
                <MyPageComponent member={member} />

                {/* 메인 컨텐츠 */}
                <main className="flex-grow space-y-6">

                    {/* 헤더 */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold border-l-4 border-black pl-3">주문 상세</h2>
                        <Link
                            to="/orders"
                            className="text-sm text-gray-400 hover:text-gray-700"
                        >
                            ← 주문 목록으로
                        </Link>
                    </div>

                    {/* 주문 기본 정보 */}
                    <section className="bg-white border border-gray-200 shadow-sm rounded-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">{order.createdAt?.slice(0, 10)}</p>
                                <p className="text-sm font-bold text-gray-800">ORDER_{order.orderId}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={order.status} label={order.statusLabel} />
                                {canCancel && (
                                    <button
                                        onClick={handleCancelOrder}
                                        className="text-xs px-3 py-1.5 border border-red-300 text-red-500 rounded hover:bg-red-50 transition-colors"
                                    >
                                        전체 취소
                                    </button>
                                )}
                            </div>
                        </div>

                         {/* 타임라인 추가 */}
                        <OrderTimeline order={order} history={history} />


                    </section>

                    {/* 주문 상품 목록 */}
                    <section className="bg-white border border-gray-200 shadow-sm rounded-md">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-base">주문 상품</h3>
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
                                        {/* 상품정보 */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex-shrink-0 overflow-hidden">
                                                    
                                                    {order.orderItems?.[0]?.thumbnailImageUrl ? (
                                                        <img
                                                            src={`${BASE_URL}${item.thumbnailImageUrl}`}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">No</div>
                                                    )}

                                                </div>
                                                <p className="font-medium text-gray-800 truncate max-w-[200px]">
                                                    {item.productName}
                                                </p>
                                            </div>
                                        </td>
                                        {/* 단가 */}
                                        <td className="p-4 text-right text-gray-600 whitespace-nowrap">
                                            {item.price?.toLocaleString("ko-KR")}원
                                        </td>
                                        {/* 수량 */}
                                        <td className="p-4 text-center text-gray-600">
                                            {item.quantity}
                                        </td>
                                        {/* 소계 */}
                                        <td className="p-4 text-right font-medium text-gray-800 whitespace-nowrap">
                                            {item.subtotal?.toLocaleString("ko-KR")}원
                                        </td>
                                        {/* 상태 */}
                                        <td className="p-4 text-center">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                item.status === 1
                                                    ? "bg-red-100 text-red-500"
                                                    : "bg-gray-100 text-gray-500"
                                            }`}>
                                                {item.statusLabel}
                                            </span>
                                        </td>
                                        {/* 개별 취소 */}
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
                        {order.status !== 4 && order.status !== 5 && (
                            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                                <div className="text-sm space-y-1 text-right">
                                    <p className="text-gray-500">
                                        상품 금액 <span className="text-gray-800 font-medium ml-4">
                                            {totalItemPrice?.toLocaleString("ko-KR")}원
                                        </span>
                                    </p>
                                    <p className="text-gray-500">
                                        배송비 <span className="text-gray-800 font-medium ml-4">
                                            + {deliveryFee?.toLocaleString("ko-KR")}원
                                        </span>
                                    </p>
                                    <p className="text-base font-bold text-gray-900 pt-1 border-t border-gray-100">
                                        최종 결제금액 <span className="ml-4">
                                            {order.totalPrice?.toLocaleString("ko-KR")}원
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* 배송지 정보 */}
                    {order.status !== 5 && (
                    <section className="bg-white border border-gray-200 shadow-sm rounded-md p-6">
                        <h3 className="font-bold text-base mb-4">배송지 정보</h3>
                        <table className="w-full text-sm border-t border-gray-100">
                            <tbody>
                                <tr className="border-b border-gray-50">
                                    <td className="p-4 w-32 bg-gray-50 font-bold text-gray-600">받는 분</td>
                                    <td className="p-4">{order.receiverName}</td>
                                </tr>
                                <tr className="border-b border-gray-50">
                                    <td className="p-4 w-32 bg-gray-50 font-bold text-gray-600">연락처</td>
                                    <td className="p-4">{formatPhone(order.receiverTel ?? "")}</td>
                                </tr>
                                <tr className="border-b border-gray-50">
                                    <td className="p-4 w-32 bg-gray-50 font-bold text-gray-600">주소</td>
                                    <td className="p-4">{order.address} {order.addressDetail}</td>
                                </tr>
                                <tr className="border-b border-gray-50">
                                    <td className="p-4 w-32 bg-gray-50 font-bold text-gray-600">우편번호</td>
                                    <td className="p-4">{order.zipcode}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    )}

                    {/* 결제 정보 */}
                    {order.status === 5 ? (
                        <section className="bg-red-50 border border-red-200 shadow-sm rounded-md p-6">
                            <h3 className="font-bold text-base mb-2 text-red-600">결제 실패</h3>
                            <p className="text-sm text-red-400">결제가 완료되지 않은 주문입니다.</p>
                        </section>
                    ) : (
                    <section className="bg-white border border-gray-200 shadow-sm rounded-md p-6">
                        <h3 className="font-bold text-base mb-4">결제 정보</h3>
                        <table className="w-full text-sm border-t border-gray-100">
                            <tbody>
                                <tr className="border-b border-gray-50">
                                    <td className="p-4 w-32 bg-gray-50 font-bold text-gray-600">결제 수단</td>
                                    <td className="p-4">{order.paymentMethod ?? "-"}</td>
                                </tr>
                                <tr className="border-b border-gray-50">
                                    <td className="p-4 w-32 bg-gray-50 font-bold text-gray-600">결제 일시</td>
                                    <td className="p-4">{order.paidAt?.replace("T", " ").slice(0, 16) ?? "-"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    )}
                </main>
            </div>
        </BasicLayout>
    );
}