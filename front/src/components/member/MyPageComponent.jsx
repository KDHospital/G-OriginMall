import { useEffect, useState } from "react";
import { getMemberInfo , withdrawMember} from "../../api/memberApi"
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../api/axios";

const MyPageComponent = () => {


    const [member, setMember] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showWithdrawInput , setShowWithdrawInput] =useState(null)
    const [ withdrawPw, setWithdrawPw]= useState("")
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

    // 최근 주문, 장바구니 관련 상태 값
    const [orderSummary, setOrderSummary] = useState({ total: 0, delivering: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    // 상태 뱃지 스타일
    const STATUS_STYLE = {
        0: "bg-gray-100 text-gray-500",
        1: "bg-blue-100 text-blue-600",
        2: "bg-yellow-100 text-yellow-600",
        3: "bg-green-100 text-green-600",
        4: "bg-red-100 text-red-500",
    };

    // 상태 뱃지 함수
    function StatusBadge({ status, label }) {
        return (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLE[status] ?? "bg-gray-100 text-gray-500"}`}>
                {label}
            </span>
        );
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

    // 전체 주문 수 
    axiosInstance.get("/orders?page=0&size=100")
    .then((res) => {
        const allOrders = res.data.content;
        setOrderSummary({
            total: res.data.totalElements,
            delivering: allOrders.filter(o => o.status === 2).length,
        });
        // 최근 3건
        setRecentOrders(allOrders.slice(0, 3));
    })
    .catch((err) => console.error("주문 내역 로드 실패:", err));

    // 최근 주문 3건
    axiosInstance.get("/orders?page=0&size=3")
        .then((res) => setRecentOrders(res.data.content))
        .catch((err) => console.error("주문 내역 로드 실패:", err));

    // 장바구니 수량
    axiosInstance.get("/cart")
    .then((res) => {
        setCartCount(res.data.items?.length ?? 0);
    })
    .catch((err) => console.error("장바구니 로드 실패:", err));


  }, [navigate]);

  const moveToModidyPage = () => {
        navigate("/modifypage")
  }
  if(loading){
    return <div className="text-center p-20 font-bold">데이터를 불러오는 중입니다.</div>
  }

const handleWithdrawAction = () => {
  if (!withdrawPw) return alert("비밀번호를 입력해주세요.");

    if (window.confirm("정말로 탈퇴하시겠습니까? 모든 정보가 삭제됩니다.")) {
      const data = {
        id: String(member.id),
        mpwd: withdrawPw,
      };

      withdrawMember(data)
        .then((res) => {
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

}

  return(
    <div className="max-w-7xl mx-auto flex gap-8 p-10 bg-gray-50 min-h-screen">
        {/*--- 좌측 사이드바 ---*/}

        <aside className="w-64 flex-shrink-0 bg-white p-6 shadow-sm rounded-lg border border-gray-100">
        <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-gray-200 rounded-full mb-3 flex items-center justify-center">
            <span className="text-3xl">👤</span>
        </div>
        <h3 className="font-bold text-lg">{member.mname}</h3>
        <p className="text-xs text-gray-400">{member.loginId}</p>
        </div>

        <nav className="space-y-1 text-sm">
            <div className="font-bold text-gray-400 mb-2 mt-4 text-xs uppercase">주문</div>
          <Link to="/orders" className="block p-2 text-green-600 font-bold bg-green-50 rounded">
              주문 내역
          </Link>
          <div className="p-2 hover:bg-gray-50 rounded cursor-pointer text-gray-600">배송 조회</div>

          <div className="font-bold text-gray-400 mb-2 mt-4 text-xs uppercase">계정</div>
          <div className="p-2 hover:bg-gray-50 rounded cursor-pointer text-gray-600" onClick={moveToModidyPage}>회원 정보 수정</div>
          <div className="p-2 hover:bg-gray-50 rounded cursor-pointer text-gray-600">배송지 관리</div>
        { !showWithdrawInput ? (
          <button
          onClick={()=> setShowWithdrawInput(true)}
          className="w-full mt-10 p-2 text-gray-300 text-xs border border-gray-200 hover:bg-red-50 hover:text-red-400 transition-all"
          >
            탈퇴하기
          </button>) :(
            <div className="mt-10 p-3 bg-red-50 rounded-lg space-y-2 border border-red-100">
              <p className="text-[10px] text-red-500 font-bold text-center">비밀번호를 입력하세요</p>
            <input 
            type="password"
            className="w-full p-2 text-xs border rounded outline-none focus:ring-1 focus:ring-red-400"
            value={withdrawPw}
            onChange={(e) => setWithdrawPw(e.target.value)}
            placeholder="Password"/>
            <div className="flex gap-1">
              <button
              onClick={handleWithdrawAction}
              className="flex-1 bg-red-400 text-white text-[10px] py-1 rounded hover:bg-red-500"
              >
                탈퇴 확인
              </button>
              <button
              onClick={() => {setShowWithdrawInput(false)
                              setWithdrawPw("")
              }}
              className="flex-1 bg-gray-200 text-gray-600 text-[10px] py-1 rounded hover:bg-gray-300"
              >
                취소
              </button>

            </div>
            </div>
          )}
        </nav>
        </aside>
   {/* --- 우측 메인 컨텐츠 --- */}
      <main className="flex-grow space-y-6">
        <h2 className="text-2xl font-bold border-l-4 border-black pl-3">마이페이지</h2>
   {/* 요약 정보 카드 (전체주문/배송/장바구니) */}
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
  
   {/* 최근 주문 내역*/}
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
                          {/* 주문일 */}
                          <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                              {order.createdAt?.slice(0, 10)}
                          </td>
                          {/* 주문번호 */}
                          <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                              ORD-{String(order.orderId).padStart(8, "0")}
                          </td>
                          {/* 상품정보 */}
                          <td className="p-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex-shrink-0 overflow-hidden">
                                      {order.orderItems?.[0]?.thumbnailImageUrl ? (
                                          <img
                                              src={order.orderItems[0].thumbnailImageUrl}
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
                                              <span className="text-gray-400"> 외 {order.orderItems.length - 1}건</span>
                                          )}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                          수량 {order.orderItems?.[0]?.quantity}
                                      </p>
                                  </div>
                              </div>
                          </td>
                          {/* 결제금액 */}
                          <td className="p-4 text-right font-medium text-gray-800 whitespace-nowrap">
                              {order.totalPrice?.toLocaleString("ko-KR")}원
                          </td>
                          {/* 상태 */}
                          <td className="p-4 text-center">
                              <StatusBadge status={order.status} label={order.statusLabel} />
                          </td>
                          {/* 관리 */}
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
    

  
   {/* 회원정보 테이블 */}
        <section className="bg-white p-8 border border-gray-200 shadow-sm rounded-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">회원 정보</h3>
            <button className="text-sm border border-gray-300 px-4 py-1 hover:bg-gray-50" onClick={moveToModidyPage}>수정하기</button>
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