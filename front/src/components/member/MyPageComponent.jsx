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
       <aside className="w-64 flex-shrink-0 bg-white p-6 shadow-md rounded-lg border border-green-100">
        {/* 1. 프로필 섹션: 그린 테두리 포인트 */}
        <div className="flex flex-col items-center mb-8 pb-6 border-b border-gray-100">
            <div className="relative group">
                {/* 프로필 이미지 배경: 연한 초록 */}
                <div className="w-20 h-20 bg-green-50 rounded-full mb-3 flex items-center justify-center border-2 border-green-200 shadow-inner group-hover:border-green-400 transition-all">
                    <span className="text-3xl group-hover:scale-110 transition-transform">👤</span>
                </div>
                
            </div>
            {member && (
                <>
                    <h3 className="font-bold text-lg text-gray-800">{member.mname}</h3>
                    {/* 아이디 표시: 메인 초록색 활용 */}
                    <p className="text-xs text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded-full mt-1">
                        {member.loginId.includes('@naver.com') ? member.loginId.split('@')[0] : member.loginId}
                    </p>
                </>
            )}
        </div>

        {/* 2. 네비게이션 */}
        <nav className="space-y-1 text-sm">
            {/* 시스템 관리: 관리자용 (메인 초록색 포인트) */}
            {isAdmin && (
                <div className="pb-2">
                    <div className="font-black text-green-800 mb-2 mt-4 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 시스템 관리
                    </div>
                    <div className="space-y-1">
                        {navItem("/admin", "대시보드")}
                        {navItem("/admin/members", "일반 회원 관리")}
                        {navItem("/admin/sellers", "판매자 관리")}
                    </div>
                </div>
            )}

            {/* 판매 관리: 판매자용 */}
            {isSeller && (
                <div className="pb-2">
                    <div className="font-black text-green-700 mb-2 mt-4 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> 판매 관리
                    </div>
                    <div className="space-y-1">
                        {navItem("/seller", "대시보드")}
                        {navItem("/seller/products", "내 상품 목록")}
                    </div>
                </div>
            )}

            {/* 주문 관리: 일반 회원용 */}
            {!isSeller && !isAdmin && (
                <div className="pb-2">
                    <div className="font-black text-gray-400 mb-2 mt-4 text-[10px] uppercase tracking-wider">주문/쇼핑</div>
                    <div className="space-y-1">
                        {navItem("/orders", "주문 내역")}
                        {navItem("/cart", "장바구니")}
                    </div>
                </div>
            )}

            {/* 공통 계정 관리 */}
            <div className="pb-2">
                <div className="font-black text-gray-400 mb-2 mt-4 text-[10px] uppercase tracking-wider">계정 설정</div>
                <div className="space-y-1">
                    {navItem("/modifypage", "회원 정보 수정")}
                    {!isSeller && !isAdmin && navItem("/addresses", "배송지 관리")}
                </div>
            </div>

            {/* 3. 탈퇴하기: 서브 노랑 & 레드 조합 */}
            {!showWithdrawInput ? (
                <button
                    onClick={() => setShowWithdrawInput(true)}
                    className="w-full mt-10 p-2.5 text-gray-400 text-[11px] border border-gray-100 rounded hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200 transition-all font-medium flex items-center justify-center gap-1"
                >
                    <span className="text-amber-500">⚠</span> 서비스 탈퇴하기
                </button>
            ) : (
                <div className="mt-10 p-4 bg-yellow-50 rounded border border-yellow-200 space-y-3 shadow-inner animate-fadeIn">
                    <p className="text-[10px] text-yellow-900 font-bold text-center">보안을 위해 비밀번호를 입력하세요</p>
                    <input
                        type="password"
                        className="w-full p-2.5 text-xs border border-yellow-300 rounded outline-none focus:ring-2 focus:ring-green-400 bg-white transition-all"
                        value={withdrawPw}
                        onChange={(e) => setWithdrawPw(e.target.value)}
                        placeholder="Password"
                    />
                    <div className="flex gap-1.5">
                        <button
                            onClick={handleWithdrawAction}
                            className="flex-1 bg-red-500 text-white text-[10px] py-2.5 rounded font-bold hover:bg-red-600 shadow-sm active:scale-95 transition-all"
                        >
                            탈퇴 확인
                        </button>
                        <button
                            onClick={() => { setShowWithdrawInput(false); setWithdrawPw(""); }}
                            className="flex-1 bg-white text-gray-500 text-[10px] py-2.5 rounded border border-gray-200 hover:bg-gray-50 transition-all"
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