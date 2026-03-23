import { useState } from "react";
import BasicLayout from "../../layouts/BasicLayout";
import FooterMenu from "../../components/menus/FooterMenu";

// ─────────────────────────────────────────
// Mock 데이터 (API 연동 후 제거)
// CartSummaryDTO 구조 기준
// ─────────────────────────────────────────
const MOCK_CART = {
  items: [
    {
      cartItemId: 1,
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
    {
      cartItemId: 2,
      productId: 102,
      sellerId: 10,
      sellerName: "김포금쌀농장",
      pname: "김포 쌀과자 선물세트",
      listPrice: 15000,
      discountPrice: 0,
      price: 15000,
      deliveryFee: 3000,
      quantity: 2,
      itemSubtotal: 30000,
      thumbnailImageUrl: null,
    },
    {
      cartItemId: 3,
      productId: 201,
      sellerId: 20,
      sellerName: "통진두부마을",
      pname: "국산콩 통진두부 모둠",
      listPrice: 12000,
      discountPrice: 2000,
      price: 10000,
      deliveryFee: 2500,
      quantity: 1,
      itemSubtotal: 10000,
      thumbnailImageUrl: null,
    },
  ],
  totalItemPrice: 80000,
  totalDeliveryFee: 5500, // sellerId 10 → 3000, sellerId 20 → 2500
  totalPrice: 85500,
};

// ─────────────────────────────────────────
// 유틸
// ─────────────────────────────────────────
const formatPrice = (n) => n?.toLocaleString("ko-KR") ?? "0";

// ─────────────────────────────────────────
// 진행 단계 컴포넌트
// ─────────────────────────────────────────
function StepIndicator({ current = 1 }) {
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
              <span
                className={`text-xs whitespace-nowrap ${isActive ? "text-gray-800 font-semibold" : "text-gray-400"}`}
              >
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
// 장바구니 상품 행
// ─────────────────────────────────────────
function CartItemRow({ item, checked, onCheck, onQuantityChange, onRemove }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* 체크박스 */}
      <td className="px-4 py-4 w-10">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onCheck(item.cartItemId)}
          className="w-4 h-4 accent-gray-700 cursor-pointer"
        />
      </td>

      {/* 썸네일 + 상품 정보 */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden border border-gray-200">
            {item.thumbnailImageUrl ? (
              <img
                src={item.thumbnailImageUrl}
                alt={item.pname}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                No Image
              </div>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">{item.sellerName}</p>
            <p className="text-sm font-medium text-gray-800">{item.pname}</p>
            {item.discountPrice > 0 && (
              <p className="text-xs text-gray-400 line-through mt-0.5">
                {formatPrice(item.listPrice)}원
              </p>
            )}
          </div>
        </div>
      </td>

      {/* 단가 */}
      <td className="px-4 py-4 text-center text-sm text-gray-700">
        {formatPrice(item.price)}원
      </td>

      {/* 수량 - / + */}
      <td className="px-4 py-4 text-center">
        <div className="inline-flex items-center border border-gray-300 rounded">
          <button
            onClick={() => onQuantityChange(item.cartItemId, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium text-gray-800 select-none">
            {item.quantity}
          </span>
          <button
            onClick={() => onQuantityChange(item.cartItemId, item.quantity + 1)}
            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-sm"
          >
            +
          </button>
        </div>
      </td>

      {/* 금액 */}
      <td className="px-4 py-4 text-center text-sm font-semibold text-gray-800">
        {formatPrice(item.price * item.quantity)}원
      </td>

      {/* 삭제 */}
      <td className="px-4 py-4 text-center w-10">
        <button
          onClick={() => onRemove(item.cartItemId)}
          className="text-gray-300 hover:text-gray-500 transition-colors text-lg leading-none"
          title="삭제"
        >
          ×
        </button>
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────
// 주문 요약 패널
// ─────────────────────────────────────────
function OrderSummary({ totalItemPrice, totalDeliveryFee, totalPrice, onOrder }) {
  const discount = 0; // 추후 쿠폰/할인 기능 연동 시 사용
  return (
    <div className="border border-gray-200 rounded p-5 bg-white sticky top-6">
      <h3 className="text-base font-bold text-gray-800 mb-4">주문 요약</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>상품 금액</span>
          <span>{formatPrice(totalItemPrice)}원</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>배송비</span>
          <span className="text-gray-800">+ {formatPrice(totalDeliveryFee)}원</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>할인</span>
          <span className="text-red-500">- {formatPrice(discount)}원</span>
        </div>
        <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-base">
          <span>최종 결제금액</span>
          <span>{formatPrice(totalPrice)}원</span>
        </div>
      </div>
      <button
        onClick={onOrder}
        className="mt-5 w-full py-3 bg-gray-800 text-white text-sm font-bold rounded hover:bg-gray-700 active:bg-gray-900 transition-colors"
      >
        주문하기
      </button>
    </div>
  );
}

// ─────────────────────────────────────────
// CartPage (메인)
// ─────────────────────────────────────────
export default function CartPage() {
  // ── 상태 ──────────────────────────────
  // TODO: API 연동 후 아래 useState를 axios 호출로 교체
  // const [cartData, setCartData] = useState(null);
  // useEffect(() => { axiosInstance.get(`/cart?memberId=${memberId}`).then(...) }, []);
  const [cartData, setCartData] = useState(MOCK_CART);
  const [checkedIds, setCheckedIds] = useState(
    MOCK_CART.items.map((i) => i.cartItemId)
  );

  if (!cartData) return null;

  const { items } = cartData;
  const allChecked = checkedIds.length === items.length;

  // ── 계산 (체크된 항목 기준) ──────────
  const checkedItems = items.filter((i) => checkedIds.includes(i.cartItemId));

  const totalItemPrice = checkedItems.reduce(
    (sum, i) => sum + i.price * i.quantity, 0
  );

  // 판매자별 배송비 중복 제거
  const totalDeliveryFee = Object.values(
    checkedItems.reduce((acc, i) => {
      if (!acc[i.sellerId]) acc[i.sellerId] = i.deliveryFee;
      return acc;
    }, {})
  ).reduce((sum, fee) => sum + fee, 0);

  const totalPrice = totalItemPrice + totalDeliveryFee;

  // ── 핸들러 ────────────────────────────
  const handleCheckAll = () => {
    setCheckedIds(allChecked ? [] : items.map((i) => i.cartItemId));
  };

  const handleCheck = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleQuantityChange = (cartItemId, newQty) => {
    if (newQty < 1) return;
    // TODO: API 연동 후 → axiosInstance.patch(`/cart/${cartItemId}?memberId=${memberId}`, { quantity: newQty })
    setCartData((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity: newQty } : i
      ),
    }));
  };

  const handleRemove = (cartItemId) => {
    // TODO: API 연동 후 → axiosInstance.delete(`/cart/${cartItemId}?memberId=${memberId}`)
    setCartData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.cartItemId !== cartItemId),
    }));
    setCheckedIds((prev) => prev.filter((id) => id !== cartItemId));
  };

  const handleRemoveChecked = () => {
    // TODO: API 연동 후 → 체크된 항목 순차 delete 또는 전체비우기 API 호출
    setCartData((prev) => ({
      ...prev,
      items: prev.items.filter((i) => !checkedIds.includes(i.cartItemId)),
    }));
    setCheckedIds([]);
  };

  const handleOrder = () => {
    // TODO: 주문 페이지로 이동 → navigate('/orders/new', { state: { checkedItems } })
    alert("주문하기 페이지로 이동합니다.");
  };

  // ── 렌더 ──────────────────────────────
  return (
    <BasicLayout>
        <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 pb-16">

            {/* 진행 단계 */}
            <StepIndicator current={1} />

            {/* 타이틀 */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">장바구니</h2>

            {items.length === 0 ? (
            /* 빈 장바구니 */
            <div className="text-center py-24 text-gray-400">
                <p className="text-4xl mb-4">🛒</p>
                <p className="text-base">장바구니가 비어 있습니다.</p>
            </div>
            ) : (
            <div className="flex gap-6 items-start">
                {/* 좌측: 상품 목록 */}
                <div className="flex-1 min-w-0">
                {/* 전체선택 / 선택삭제 */}
                <div className="flex items-center gap-3 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 select-none">
                    <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={handleCheckAll}
                        className="w-4 h-4 accent-gray-700"
                    />
                    전체선택 ({checkedIds.length}/{items.length})
                    </label>
                    <button
                    onClick={handleRemoveChecked}
                    disabled={checkedIds.length === 0}
                    className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                    선택 삭제
                    </button>
                </div>

                {/* 테이블 */}
                <div className="bg-white border border-gray-200 rounded overflow-hidden">
                    <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 text-center">
                        <th className="px-4 py-3 w-10"></th>
                        <th className="px-4 py-3 text-left">상품정보</th>
                        <th className="px-4 py-3 w-24">단가</th>
                        <th className="px-4 py-3 w-28">수량</th>
                        <th className="px-4 py-3 w-28">금액</th>
                        <th className="px-4 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                        <CartItemRow
                            key={item.cartItemId}
                            item={item}
                            checked={checkedIds.includes(item.cartItemId)}
                            onCheck={handleCheck}
                            onQuantityChange={handleQuantityChange}
                            onRemove={handleRemove}
                        />
                        ))}
                    </tbody>
                    </table>
                </div>

                {/* 쇼핑 계속하기 */}
                <div className="mt-4">
                    <button
                    onClick={() => {
                        // TODO: navigate('/products')
                        alert("상품 목록으로 이동합니다.");
                    }}
                    className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                    ← 쇼핑 계속하기
                    </button>
                </div>
                </div>

                {/* 우측: 주문 요약 */}
                <div className="w-64 flex-shrink-0">
                <OrderSummary
                    totalItemPrice={totalItemPrice}
                    totalDeliveryFee={totalDeliveryFee}
                    totalPrice={totalPrice}
                    onOrder={handleOrder}
                />
                </div>
            </div>
            )}
        </div>
        </div>
    </BasicLayout>
  );
}
