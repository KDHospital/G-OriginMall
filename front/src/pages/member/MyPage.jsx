import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMemberInfo } from "../../api/memberApi";
import axiosInstance from "../../api/axios";
import BasicLayout from "../../layouts/BasicLayout";
import MyPageComponent from "../../components/member/MyPageComponent";

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

function MyPage() {
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orderSummary, setOrderSummary] = useState({ total: 0, delivering: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    const genderMap = { 0: "미지정", 1: "남성", 2: "여성" };

    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return "";
        const num = phoneNumber.replace(/[^0-9]/g, "");
        return num.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
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
                setLoading(false);
            })
            .catch((err) => {
                console.error("내 정보 불러오기 실패:", err);
                alert("세션이 만료되었거나 정보를 가져올 수 없습니다. 다시 로그인해주세요.");
                localStorage.removeItem("member");
                navigate("/login");
            });

        // 주문 요약 + 최근 3건
        axiosInstance.get("/orders?page=0&size=100")
            .then((res) => {
                const allOrders = res.data.content;
                setOrderSummary({
                    total: res.data.totalElements,
                    delivering: allOrders.filter((o) => o.status === 2).length,
                });
                setRecentOrders(allOrders.slice(0, 3));
            })
            .catch((err) => console.error("주문 내역 로드 실패:", err));

        // 장바구니
        axiosInstance.get("/cart")
            .then((res) => setCartCount(res.data.items?.length ?? 0))
            .catch((err) => console.error("장바구니 로드 실패:", err));

    }, [navigate]);

    if (loading) {
        return <div className="text-center p-20 font-bold">데이터를 불러오는 중입니다.</div>;
    }

    return (
        <BasicLayout>
            <div className="max-w-7xl mx-auto flex gap-8 p-10 bg-gray-50 min-h-screen">

                {/* 사이드바 */}
                <MyPageComponent member={member} />

                {/* 메인 컨텐츠 */}
                <main className="flex-grow space-y-6">
                    <h2 className="text-2xl font-bold border-l-4 border-black pl-3">마이페이지</h2>

                    {/* 요약 카드 */}
                    <section className="grid grid-cols-3 gap-4">
                        {[
                            { label: "전체 주문", value: orderSummary.total, unit: "건" },
                            { label: "배송 중", value: orderSummary.delivering, unit: "건" },
                            { label: "장바구니", value: cartCount, unit: "개 상품" },
                        ].map((card) => (
                            <div key={card.label} className="bg-white border border-gray-200 rounded-md p-6 shadow-sm">
                                <p className="text-xs text-gray-400 mb-1">{card.label}</p>
                                <p className="text-3xl font-bold">{card.value}</p>
                                <p className="text-xs text-gray-400 mt-1">{card.unit}</p>
                            </div>
                        ))}
                    </section>

                    {/* 최근 주문 내역 */}
                    <section className="bg-white border border-gray-200 shadow-sm rounded-md">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-base">최근 주문 내역</h3>
                            <Link to="/orders" className="text-xs text-gray-400 hover:text-gray-700">
                                전체보기 →
                            </Link>
                        </div>
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-12 text-sm text-gray-400">
                                주문 내역이 없습니다.
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-xs text-gray-500">
                                        <th className="p-4 text-left font-medium">주문일</th>
                                        <th className="p-4 text-left font-medium">주문번호</th>
                                        <th className="p-4 text-left font-medium">상품정보</th>
                                        <th className="p-4 text-right font-medium">결제금액</th>
                                        <th className="p-4 text-center font-medium">상태</th>
                                        <th className="p-4 text-center font-medium">관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.orderId} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                                                {order.createdAt?.slice(0, 10)}
                                            </td>
                                            <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                                                ORDER_{order.orderId}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex-shrink-0 overflow-hidden">
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">No</div>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800 truncate max-w-[200px]">
                                                            {order.orderItems?.[0]?.productName}
                                                            {order.orderItems?.length > 1 && (
                                                                <span className="text-gray-400"> 외 {order.orderItems.length - 1}건</span>
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
                                                    className="text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
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

                    {/* 회원 정보 */}
                    <section className="bg-white p-8 border border-gray-200 shadow-sm rounded-md">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">회원 정보</h3>
                            <button
                                className="text-sm border border-gray-300 px-4 py-1 hover:bg-gray-50"
                                onClick={() => navigate("/modifypage")}
                            >
                                수정하기
                            </button>
                        </div>
                        <table className="w-full text-sm border-t border-gray-100">
                            <tbody>
                                <tr className="border-b border-gray-50"><td className="p-4 w-40 bg-gray-50 font-bold text-gray-600">아이디</td><td className="p-4">{member.loginId}</td></tr>
                                <tr className="border-b border-gray-50"><td className="p-4 w-40 bg-gray-50 font-bold text-gray-600">이름</td><td className="p-4">{member.mname}</td></tr>
                                <tr className="border-b border-gray-50"><td className="p-4 w-40 bg-gray-50 font-bold text-gray-600">연락처</td><td className="p-4">{formatPhoneNumber(member.tel)}</td></tr>
                                <tr className="border-b border-gray-50"><td className="p-4 w-40 bg-gray-50 font-bold text-gray-600">성별</td><td className="p-4">{genderMap[member.gender] || "정보 없음"}</td></tr>
                                <tr className="border-b border-gray-50"><td className="p-4 w-40 bg-gray-50 font-bold text-gray-600">가입일</td><td className="p-4">2026-01-15</td></tr>
                            </tbody>
                        </table>
                    </section>
                </main>
            </div>
        </BasicLayout>
    );
}
export default MyPage;