import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { withdrawMember } from "../../api/memberApi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";

export default function MyPageSidebar({ member }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [showWithdrawInput, setShowWithdrawInput] = useState(false);
    const [withdrawPw, setWithdrawPw] = useState("");
    
    const localData = JSON.parse(localStorage.getItem("member"))
    const effectiveRole = member?.role !== null ? member?.role : localData?.role
    const isSeller = Number(effectiveRole) === 1;
    const isAdmin = Number(effectiveRole) === 2
    
    const navItem = (to, label) => (
        <Link
            to={to}
            className={`block p-2 rounded transition-colors ${
                location.pathname === to
                    ? "text-green-600 font-bold bg-green-50"
                    : "text-gray-600 hover:bg-gray-50"
            }`}
        >
            {label}
        </Link>
    );

    const handleWithdrawAction = () => {
        if (!withdrawPw) return alert("비밀번호를 입력해주세요.");

        if (window.confirm("정말로 탈퇴하시겠습니까? 모든 정보가 삭제됩니다.")) {
            const data = {
                id: String(member.id),
                mpwd: withdrawPw,
            };

            withdrawMember(data)
                .then(() => {
                    alert("탈퇴 처리가 완료되었습니다. 이용해주셔서 감사합니다.");
                    localStorage.removeItem("member");
                    delete axiosInstance.defaults.headers.common["Authorization"];
                    navigate("/");
                    window.location.reload();
                })
                .catch((err) => {
                    alert(err.response?.data?.message || "탈퇴 처리 중 오류가 발생했습니다.");
                });
        }
    };

    return (
        <aside className="w-64 flex-shrink-0 bg-white p-6 shadow-sm rounded-lg border border-gray-100">
            {/* 프로필 */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-3 flex items-center justify-center">
                    <span className="text-3xl">👤</span>
                </div>
                {member && (
                    <>
                        <h3 className="font-bold text-lg">{member.mname}</h3>
                        <p className="text-xs text-gray-400">{member.loginId}</p>
                    </>
                )}
            </div>

            {/* 네비게이션 */}
            <nav className="space-y-1 text-sm">
                {isAdmin && (<>
                    <div className="font-bold text-red-500 mb-2 mt-4 text-xs uppercase">시스템 관리</div>
                    {navItem("/admin","대시보드")}
                    {navItem("/admin/members", "일반 회원 관리")}
                    {navItem("/admin/sellers", "판매자 관리")}
                 
               </> )}
                {isSeller && (<>
                    <div className="font-bold text- gray-400 mb-2 mt-4 text-xs uppercase">판매 관리</div>
                    {navItem("/seller","대시보드")}
                    {navItem("/seller/products","내 상품 목록")}
                 
               </> )}
               {!isSeller && !isAdmin && ( <>
                <div className="font-bold text-gray-400 mb-2 mt-4 text-xs uppercase">주문</div>
                {navItem("/orders", "주문 내역")}
                {navItem("/cart", "장바구니")}
                 </> )}
                <div className="font-bold text-gray-400 mb-2 mt-4 text-xs uppercase">계정</div>
                {navItem("/modifypage", "회원 정보 수정")}
                {!isSeller && !isAdmin && navItem("/addresses", "배송지 관리")}

                {/* 탈퇴하기 */}
                {!showWithdrawInput ? (
                    <button
                        onClick={() => setShowWithdrawInput(true)}
                        className="w-full mt-10 p-2 text-gray-300 text-xs border border-gray-200 hover:bg-red-50 hover:text-red-400 transition-all"
                    >
                        탈퇴하기
                    </button>
                ) : (
                    <div className="mt-10 p-3 bg-red-50 rounded-lg space-y-2 border border-red-100">
                        <p className="text-[10px] text-red-500 font-bold text-center">비밀번호를 입력하세요</p>
                        <input
                            type="password"
                            className="w-full p-2 text-xs border rounded outline-none focus:ring-1 focus:ring-red-400"
                            value={withdrawPw}
                            onChange={(e) => setWithdrawPw(e.target.value)}
                            placeholder="Password"
                        />
                        <div className="flex gap-1">
                            <button
                                onClick={handleWithdrawAction}
                                className="flex-1 bg-red-400 text-white text-[10px] py-1 rounded hover:bg-red-500"
                            >
                                탈퇴 확인
                            </button>
                            <button
                                onClick={() => { setShowWithdrawInput(false); setWithdrawPw(""); }}
                                className="flex-1 bg-gray-200 text-gray-600 text-[10px] py-1 rounded hover:bg-gray-300"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </aside>
    );
}