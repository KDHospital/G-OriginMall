import { useEffect, useState } from "react";
import { getMemberInfo } from "../../api/memberApi"
import { useNavigate } from "react-router-dom";

const MyPageComponent = () => {

    const [member, setMember] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const genderMap = {
        0: "미지정",
        1: "남성",
        2: "여성"
    }
    const formatPhoneNumber = (phoneNumber) => {
        if(!phoneNumber) return""

        const savedNumber = phoneNumber.replace(/[^0-9]/g,"")

        return savedNumber.replace(/(\d{3})(\d{4})(\d{4})/,"$1-$2-$3")
    }

useEffect(() => {
    
    const savedMember = localStorage.getItem("member");

    if (!savedMember) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

   
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
  }, [navigate]);

  if(loading){
    return <div className="text-center p-20 font-bold">데이터를 불러오는 중입니다.</div>
  }
  return(
    <div className="max-w-7xl mx-auto flex gap-8 p-10 bg-gray-50 min-h-screen">
        {/*--- 좌측 사이드바 ---*/}

        <asied className="w-64 flex-shrink-0 bg-white p-6 shadow-sm rounded-lg border border-gray-100">
        <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-gray-200 rounded-full mb-3 flex items-center justify-center">
            <span className="text-3xl">👤</span>
        </div>
        <h3 className="font-bold text-lg">{member.mname}</h3>
        <p className="text-xs text-gray-400">{member.loginId}</p>
        </div>

        <nav className="space-y-1 text-sm">
            <div className="font-bold text-gray-400 mb-2 mt-4 text-xs uppercase">주문</div>
          <div className="p-2 text-green-600 font-bold bg-green-50 rounded cursor-pointer">주문 내역</div>
          <div className="p-2 hover:bg-gray-50 rounded cursor-pointer text-gray-600">배송 조회</div>

          <div className="font-bold text-gray-400 mb-2 mt-4 text-xs uppercase">계정</div>
          <div className="p-2 hover:bg-gray-50 rounded cursor-pointer text-gray-600">회원 정보 수정</div>
          <div className="p-2 hover:bg-gray-50 rounded cursor-pointer text-gray-600">배송지 관리</div>
        <button className="w-full mt-10 p-2 text-gray-300 text-xs border border-gray-200 rounded hover:bg-red-50 hover:text-red-400 transition-all">
            탈퇴하기
          </button>
        </nav>
        </asied>
   {/* --- 우측 메인 컨텐츠 --- */}
      <main className="flex-grow space-y-6">
        <h2 className="text-2xl font-bold border-l-4 border-black pl-3">마이페이지</h2>
   {/* 요약 정보 카드 (전체주문/배송/장바구니) */}
  
   {/* 최근 주문 내역*/}
  
   {/* 회원정보 테이블 */}
        <section className="bg-white p-8 border border-gray-200 shadow-sm rounded-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">회원 정보</h3>
            <button className="text-sm border border-gray-300 px-4 py-1 hover:bg-gray-50">수정하기</button>
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
  )

 
   

}
export default MyPageComponent