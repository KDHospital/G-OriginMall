import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import axiosInstance from "../../api/axios";
import { useCart } from "../../context/CartContext";



export default function OrderSuccessPage() {
  const { fetchCartCount } = useCart();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const source = searchParams.get("source");

  // Toss OrderId에서 ORDER_ 부분 제외 파싱
  const realOrderId = orderId?.split("_")[1];

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {

    if (!paymentKey || !orderId || !amount) {
      setStatus("error");
      setErrorMsg("결제 정보가 올바르지 않습니다.");
      return;
    }

    

    // 백엔드 최종 승인 요청
    axiosInstance
      .post(`/orders/${realOrderId}/confirm`, {
        tossOrderId: orderId,   // ORDER_10 형태 그대로 추가
        paymentKey,
        amount: Number(amount),
      })
      .then(() => {
        if (source === "cart") {
          // 장바구니에서 진입 시 장바구니 삭제
          return axiosInstance.delete("/cart").then(()=>fetchCartCount());
        }
      })
      .then(() => {
        setStatus("success");
      })
      .catch((err) => {
        console.error("결제 승인 실패:", err);
        setStatus("error");
        setErrorMsg(
          err.response?.data?.message ?? "결제 승인 중 오류가 발생했습니다."
        );
      });
  }, []);

  // ── 로딩 ──────────────────────────────────────
  if (status === "loading") {
    return (
      <BasicLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500">결제를 확인하는 중입니다...</p>
          </div>
        </div>
      </BasicLayout>
    );
  }

  // ── 오류 ──────────────────────────────────────
  if (status === "error") {
    return (
      <BasicLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white border border-gray-200 rounded p-8 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-xl">✕</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">결제 실패</h2>
            <p className="text-sm text-gray-500 mb-6">{errorMsg}</p>
            <button
              onClick={() => navigate(-1)}
              className="w-full py-2.5 bg-gray-800 text-white text-sm font-bold rounded hover:bg-gray-700 transition-colors"
            >
              돌아가기
            </button>
          </div>
        </div>
      </BasicLayout>
    );
  }

  // ── 성공 ──────────────────────────────────────
  return (
    <BasicLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded p-8 max-w-sm w-full text-center">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl">✓</span>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">결제가 완료되었습니다</h2>
          <p className="text-sm text-gray-500 mb-1">주문번호: {orderId}</p>
          <p className="text-sm text-gray-500 mb-6">
            결제금액: {Number(amount).toLocaleString("ko-KR")}원
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/orders")}
              className="w-full py-2.5 bg-gray-800 text-white text-sm font-bold rounded hover:bg-gray-700 transition-colors"
            >
              주문 내역 보기
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full py-2.5 border border-gray-300 text-gray-600 text-sm font-bold rounded hover:bg-gray-50 transition-colors"
            >
              쇼핑 계속하기
            </button>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
}