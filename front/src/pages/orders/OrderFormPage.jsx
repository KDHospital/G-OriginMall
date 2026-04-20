import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import axiosInstance from "../../api/axios";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { BASE_URL } from "../../util/imagesUtil";
import AddressSection from "../../components/member/AddressSection";



// 상품 상세 → 바로 구매 진입 시 사용할 mock
// 실제로는 ProductDetailPage에서 navigate state로 전달받음
const MOCK_DIRECT_ITEM = [
  {
    cartItemId: null,   // 바로 구매는 cartItemId 없음
    productId: 101,
    sellerId: 10,
    sellerName: "김포금쌀농장",
    pname: "김포금쌀 10kg",
    listPrice: 45000,
    discountPrice: 5000,
    price: 40000,
    deliveryFee: 3000,
    quantity: 1,
    itemSubtotal: 40000,
    thumbnailImageUrl: null,
  },
];

const DELIVERY_MEMO_OPTIONS = [
  "배송 요청사항을 선택해주세요",
  "문 앞에 놓아주세요",
  "경비실에 맡겨주세요",
  "택배함에 넣어주세요",
  "직접 받겠습니다",
  "직접 입력",
];
// ─────────────────────────────────────────
// toss client key
// ─────────────────────────────────────────
const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;


// ─────────────────────────────────────────
// 유틸
// ─────────────────────────────────────────
const formatPrice = (n) => n?.toLocaleString("ko-KR") ?? "0";

// ─────────────────────────────────────────
// 진행 단계 컴포넌트
// ─────────────────────────────────────────
function StepIndicator({ current = 2 }) {
  const steps = ["장바구니", "주문 정보 입력", "결제"];
  return (
    <div className="flex items-center justify-center gap-0 py-8">
      {steps.map((label, idx) => {
        const step = idx + 1;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                  ${isActive ? "bg-gray-800 border-gray-800 text-white" : isDone ? "bg-gray-400 border-gray-400 text-white" : "bg-white border-gray-300 text-gray-400"}`}
              >
                {step}
              </div>
              <span className={`text-xs whitespace-nowrap ${isActive ? "text-gray-800 font-semibold" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="w-20 h-px bg-gray-300 mb-4 mx-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────
// 배송 요청사항 섹션
// ─────────────────────────────────────────
function DeliveryMemoSection({ value, onChange }) {
  const [isCustom, setIsCustom] = useState(false);

  const handleSelect = (e) => {
    const val = e.target.value;
    if (val === "직접 입력") {
      setIsCustom(true);
      onChange("");
    } else {
      setIsCustom(false);
      onChange(val === DELIVERY_MEMO_OPTIONS[0] ? "" : val);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-5 mb-4">
      <h3 className="text-sm font-bold text-gray-800 mb-3">배송 요청사항</h3>
      <select
        onChange={handleSelect}
        className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-gray-400 bg-white"
      >
        {DELIVERY_MEMO_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {isCustom && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="배송 요청사항을 입력해주세요"
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 mt-2"
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// 결제 수단 섹션
// ─────────────────────────────────────────
function PaymentSection({ selected, onChange }) {
  return (
    <div className="bg-white border border-gray-200 rounded p-5 mb-4">
      <h3 className="text-sm font-bold text-gray-800 mb-3">결제 수단</h3>
      <label
        className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition-colors
          ${selected === "toss" ? "border-gray-800 bg-gray-50" : "border-gray-200 hover:bg-gray-50"}`}
      >
        <input
          type="radio"
          name="payment"
          value="toss"
          checked={selected === "toss"}
          onChange={() => onChange("toss")}
          className="accent-gray-700"
        />
        <div>
          <span className="text-sm font-medium text-gray-800">토스페이</span>
          <span className="text-xs text-gray-400 ml-2">카드 · 계좌이체 · 간편결제</span>
        </div>
      </label>
      <p className="text-xs text-gray-400 mt-2 pl-1">
        * 결제 시 토스페이먼츠 페이지에서 진행됩니다
      </p>
    </div>
  );
}

// ─────────────────────────────────────────
// 약관 동의 섹션
// ─────────────────────────────────────────
const TERMS = [
  { id: "purchase", label: "[필수] 구매조건 확인 및 결제 진행 동의", required: true },
  { id: "privacy", label: "[필수] 개인정보 수집 · 이용 동의", required: true },
  { id: "marketing", label: "[선택] 마케팅 정보 수신 동의", required: false },
];

function TermsSection({ agreed, onChange }) {
  const allChecked = TERMS.every((t) => agreed[t.id]);

  const handleAll = () => {
    const newVal = !allChecked;
    const updated = {};
    TERMS.forEach((t) => { updated[t.id] = newVal; });
    onChange(updated);
  };

  const handleOne = (id) => {
    onChange({ ...agreed, [id]: !agreed[id] });
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-5 mb-4">
      <h3 className="text-sm font-bold text-gray-800 mb-3">약관 동의</h3>
      <label className="flex items-center gap-2 cursor-pointer mb-3 pb-3 border-b border-gray-100">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={handleAll}
          className="w-4 h-4 accent-gray-700"
        />
        <span className="text-sm font-medium text-gray-800">전체 동의</span>
      </label>
      <div className="space-y-2">
        {TERMS.map((term) => (
          <label key={term.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed[term.id] || false}
              onChange={() => handleOne(term.id)}
              className="w-4 h-4 accent-gray-700"
            />
            <span className="text-xs text-gray-600">{term.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 주문 상품 요약 패널 (우측)
// ─────────────────────────────────────────
function OrderSummaryPanel({ items, onSubmit, canSubmit }) {
  const totalItemPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const totalListPrice = items.reduce((sum, i) => sum + i.listPrice * i.quantity, 0);

  const totalDiscountPrice = items.reduce((sum, i) => sum + i.discountPrice * i.quantity, 0);

  const totalDeliveryFee = Object.values(
    items.reduce((acc, i) => {
      if (!acc[i.sellerId]) acc[i.sellerId] = i.deliveryFee;
      return acc;
    }, {})
  ).reduce((sum, fee) => sum + fee, 0);
  const totalPrice = totalItemPrice + totalDeliveryFee;

  return (
    <div className="border border-gray-200 rounded bg-white sticky top-6">
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 mb-3">주문 상품</h3>
        <div className="space-y-3">
          {items.map((item, idx) => (
            // cartItemId가 없는 바로 구매의 경우 productId + idx로 key 처리
            <div key={item.cartItemId ?? `${item.productId}-${idx}`} className="flex gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 border border-gray-200 overflow-hidden">
                {item.thumbnailImageUrl ? (
                  <img src={`${BASE_URL}${item.thumbnailImageUrl}`} alt={item.pname} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{item.pname}</p>
                <p className="text-xs text-gray-400">{item.sellerName}</p>
                <p className="text-xs font-semibold text-gray-700 mt-0.5">
                  {formatPrice(item.price * item.quantity)}원 · {item.quantity}개
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
            <span>상품 금액</span>
            <span>{formatPrice(totalListPrice)}원</span>
        </div>
        <div className="flex justify-between text-gray-600">
            <span>배송비</span>
            <span>+ {formatPrice(totalDeliveryFee)}원</span>
        </div>
        <div className="flex justify-between text-gray-600">
            <span>할인</span>
            <span className="text-red-500">- {formatPrice(totalDiscountPrice)}원</span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base">
          <span>최종 결제금액</span>
          <span>{formatPrice(totalPrice)}원</span>
        </div>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="mt-3 w-full py-3 bg-gray-800 text-white text-sm font-bold rounded hover:bg-gray-700 active:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          결제하기
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// OrderFormPage (메인)
// ─────────────────────────────────────────
export default function OrderFormPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // ── 진입 경로 구분 ─────────────────────
  // source: "cart"   → CartPage에서 체크된 상품 전달
  // source: "direct" → ProductDetailPage에서 바로 구매 전달
  // source 없음      → 직접 URL 접근 (개발 시 mock fallback)
  const { orderItems: passedItems, source } = location.state ?? {};

  // ── 상품 데이터 결정 ───────────────────
  // 전달받은 데이터가 있으면 사용, 없으면 mock fallback (개발 편의용)
  const [orderItems] = useState(passedItems ?? MOCK_DIRECT_ITEM);

  // -- 배송지 데이터 불러오기 --
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
      axiosInstance.get("/members/addresses")
          .then((res) => {
              setAddresses(res.data);
              const def = res.data.find((a) => a.default);
              if (def) setSelectedAddressId(def.addressId);
          })
          .catch((err) => console.error("배송지 로드 실패:", err));
  }, []);

  const handleAddAddress = (newAddr) => {
    setAddresses((prev) => [...prev, newAddr]);
}

  const [deliveryMemo, setDeliveryMemo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("toss");
  const [agreed, setAgreed] = useState({ purchase: false, privacy: false, marketing: false });

  const requiredAgreed = TERMS.filter((t) => t.required).every((t) => agreed[t.id]);
  const canSubmit = selectedAddressId !== null && paymentMethod !== "" && requiredAgreed;

  const handleSubmit = async () => {
    const selectedAddress = addresses.find((a) => a.addressId === selectedAddressId);
    if(!selectedAddress) {
      alert("배송지를 선택하거나 추가해주세요.");
      return;
    }


    const orderData = {
      orderItems: orderItems.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
      receiverName: selectedAddress.recipientName,
      receiverTel: selectedAddress.recipientPhone,
      zipcode: selectedAddress.zipcode,
      address: selectedAddress.address,
      addressDetail: selectedAddress.addressDetail,
      deliveryMemo,
      paymentMethod,
    };

    try {
      // 1. 주문 생성
      const res = await axiosInstance.post("/orders", orderData);
      const createdOrders = res.data; // List<OrderResponseDTO>
      const orderId = createdOrders[0]?.orderId;
      const totalAmount = createdOrders.reduce((sum, o) => sum + o.totalPrice, 0);

      // 2. 토스 SDK 초기화
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      const payment = tossPayments.payment({ customerKey: "anonymous" });

      // 3. 토스 결제창 호출
      await payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: totalAmount,
        },
        orderId: `ORDER_${orderId}_${Date.now()}`,           // 토스 orderId = 우리 ORDER_orderId
        orderName: orderItems[0]?.pname +
          (orderItems.length > 1 ? ` 외 ${orderItems.length - 1}건` : ""),
        successUrl: `${window.location.origin}/orders/success?source=${source ?? "direct"}`,
        failUrl: `${window.location.origin}/orders/fail?orderId=${orderId}`,
        customerEmail: "",                  // 선택값
        customerName: selectedAddress.recipientName,
      });

    } catch (err) {
      // 사용자가 결제창 닫은 경우도 여기로 들어옴
      if (err.code === "USER_CANCEL") {
        alert("결제가 취소되었습니다.");
        return;
      }
      console.error("결제 오류:", err);
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <BasicLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 pb-16">
          <StepIndicator current={2} />
          <h2 className="text-xl font-bold text-gray-800 mb-4">주문 정보 입력</h2>

          <div className="flex gap-6 items-start">
            {/* 좌측 */}
            <div className="flex-1 min-w-0">
              <AddressSection
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                onSelect={setSelectedAddressId}
                onAddAddress={handleAddAddress}
              />
              <DeliveryMemoSection value={deliveryMemo} onChange={setDeliveryMemo} />
              <PaymentSection selected={paymentMethod} onChange={setPaymentMethod} />
              <TermsSection agreed={agreed} onChange={setAgreed} />
            </div>

            {/* 우측: 주문 상품 요약 */}
            <div className="w-64 flex-shrink-0">
              <OrderSummaryPanel
                items={orderItems}
                onSubmit={handleSubmit}
                canSubmit={canSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
}
