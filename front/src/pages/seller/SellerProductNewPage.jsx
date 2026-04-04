import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SellerLayout from "../../layouts/SellerLayout";
import axiosInstance from "../../api/axios";

// ─────────────────────────────────────────
// 유틸
// ─────────────────────────────────────────
const formatPrice = (n) => {
  if (!n && n !== 0) return "";
  return Number(String(n).replace(/[^0-9]/g, "")).toLocaleString("ko-KR");
};

const parsePrice = (str) => {
  return parseInt(String(str).replace(/[^0-9]/g, ""), 10) || 0;
};

// ─────────────────────────────────────────
// SellerProductNewPage
// ─────────────────────────────────────────
export default function SellerProductNewPage() {
  const navigate = useNavigate();
  const imageInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const parentCategories = categories.filter((c) => c.parentId === null);
  const childCategories = categories.filter((c) => c.parentId === selectedParentId);

  // -- 카테고리 상태 --
  useEffect(()=>{
    axiosInstance.get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("카테고리 로드 실패 : " + err));
  }, [])

  // ── 폼 상태 ───────────────────────────
  const [form, setForm] = useState({
    pname: "",
    pdesc: "",
    listPrice: "",
    discountPrice: "",
    stock: "",
    deliveryFee: "",
    soldStatus: 0,
    isCertified: false,
  });

  // 판매가 자동 계산 (정가 - 할인금액)
  const price = parsePrice(form.listPrice) - parsePrice(form.discountPrice);

  // ── 이미지 상태 ───────────────────────
  // 첫 번째 이미지 → 썸네일 자동 지정
  const [images, setImages] = useState([]); // { file, previewUrl }
  const [dragIndex, setDragIndex] = useState(null);

  // ── 핸들러 ────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const numeric = value.replace(/[^0-9]/g, "");
    setForm((prev) => ({ ...prev, [name]: numeric }));
  };

  const handleParentCategoryChange = (e) => {
    const parentId = parseInt(e.target.value);
    setSelectedParentId(parentId || null);
    setSelectedCategoryId(""); // 하위 카테고리 초기화

    // ↓ 추가 — 하위 카테고리가 없는 경우 상위 카테고리 ID 바로 사용
    const hasChildren = categories.some((c) => c.parentId === parentId);
    if (!hasChildren) {
        setSelectedCategoryId(String(parentId));
    }
  };

  // 이미지 추가
  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = ""; // input 초기화
  };

  // 이미지 삭제
  const handleImageRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 드래그 앤 드롭 순서 변경
  const handleDragStart = (index) => setDragIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newImages = [...images];
    const dragged = newImages.splice(dragIndex, 1)[0];
    newImages.splice(index, 0, dragged);
    setImages(newImages);
    setDragIndex(index);
  };

  const handleDragEnd = () => setDragIndex(null);

  // 저장
  const handleSubmit = async () => {
    // 필수값 검증
    if (!selectedCategoryId) return alert("카테고리를 선택해주세요.");
    if (!form.pname) return alert("상품명을 입력해주세요.");
    if (!form.listPrice) return alert("정가를 입력해주세요.");
    if (!form.stock) return alert("재고 수량을 입력해주세요.");
    if (!form.deliveryFee && form.deliveryFee !== 0) return alert("배송비를 입력해주세요.");
    if (images.length === 0) return alert("대표 이미지를 등록해주세요.");

    const formData = new FormData();
    formData.append("categoryId", selectedCategoryId);
    formData.append("pname", form.pname);
    formData.append("pdesc", form.pdesc);
    formData.append("listPrice", parsePrice(form.listPrice));
    formData.append("discountPrice", parsePrice(form.discountPrice));
    formData.append("price", price > 0 ? price : 0);
    formData.append("stock", form.stock);
    formData.append("deliveryFee", parsePrice(form.deliveryFee));
    formData.append("soldStatus", form.soldStatus);
    formData.append("isCertified", form.isCertified);
    formData.append("isExhibition", false); // 판매자는 기획전 불가
    images.forEach((img) => formData.append("images", img.file));

    try {
        await axiosInstance.post("/seller/products", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        alert("상품이 등록되었습니다.");
        navigate("/seller/products");
    } catch (err) {
        console.error(err);
        alert("상품 등록에 실패했습니다.");
    }
  };

  // ── 렌더 ──────────────────────────────
  return (
    <SellerLayout>
      {/* 페이지 타이틀 */}
      <h2 className="text-lg font-bold text-gray-700 border-l-4 border-green-500 pl-3 mb-5">
        상품 등록
      </h2>

      <div className="space-y-5">

        {/* ── 기본 정보 ── */}
        <section className="bg-white rounded-md p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-1">기본 정보</h3>
          <p className="text-xs text-gray-400 mb-4">product 테이블 기준</p>

          <div className="space-y-4">

            {/* 카테고리 */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                카테고리 <span className="text-red-400">*</span>
                <span className="text-gray-300 ml-1">category_id</span>
              </label>
              <div className="flex gap-2">
                <select
                  onChange={handleParentCategoryChange}
                  className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-green-400 bg-white"
                >
                  <option value="">상위 카테고리 선택</option>
                  {parentCategories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  disabled={!selectedParentId || childCategories.length === 0}
                  className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-green-400 bg-white disabled:opacity-40"
              >
                  <option value="">
                      {childCategories.length === 0 && selectedParentId
                          ? "하위 카테고리 없음"
                          : "하위 카테고리 선택"}
                  </option>
                  {childCategories.map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>
                          {c.categoryName}
                      </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 상품명 */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                상품명 <span className="text-red-400">*</span>
                <span className="text-gray-300 ml-1">pname - VARCHAR(100)</span>
              </label>
              <input
                type="text"
                name="pname"
                value={form.pname}
                onChange={handleChange}
                maxLength={100}
                placeholder="상품명 입력 (최대 100자)"
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-green-400"
              />
              <p className="text-xs text-gray-300 text-right mt-0.5">{form.pname.length}/100</p>
            </div>

            {/* 상품 설명 */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                상품 설명
                <span className="text-gray-300 ml-1">pdesc - TEXT</span>
              </label>
              <textarea
                name="pdesc"
                value={form.pdesc}
                onChange={handleChange}
                placeholder="상품에 대한 설명을 입력해주세요."
                rows={5}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-green-400 resize-none"
              />
            </div>
          </div>
        </section>

        {/* ── 가격 / 재고 / 배송 ── */}
        <section className="bg-white rounded-md p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-4">가격 / 재고 / 배송</h3>

          <div className="space-y-4">

            {/* 정가 / 할인금액 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  정가 <span className="text-red-400">*</span>
                  <span className="text-gray-300 ml-1">list_price - INT</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="listPrice"
                    value={formatPrice(form.listPrice)}
                    onChange={handlePriceChange}
                    placeholder="0 원"
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-green-400 pr-8"
                  />
                  <span className="absolute right-3 top-2 text-xs text-gray-400">원</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  할인 금액
                  <span className="text-gray-300 ml-1">discount_price - INT</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="discountPrice"
                    value={formatPrice(form.discountPrice)}
                    onChange={handlePriceChange}
                    placeholder="0 원"
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-green-400 pr-8"
                  />
                  <span className="absolute right-3 top-2 text-xs text-gray-400">원</span>
                </div>
              </div>
            </div>

            {/* 판매가 자동 계산 */}
            <div className="flex items-center justify-end gap-2 text-sm text-gray-600 bg-gray-50 rounded px-4 py-2">
              <span>판매가 (price) = 정가 − 할인금액</span>
              <span className="font-bold text-green-600 text-base ml-auto">
                = {formatPrice(price > 0 ? price : 0)} 원
              </span>
            </div>

            {/* 재고 수량 / 배송비 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  재고 수량 <span className="text-red-400">*</span>
                  <span className="text-gray-300 ml-1">stock - INT</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  min={0}
                  placeholder="0"
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-green-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  배송비 <span className="text-red-400">*</span>
                  <span className="text-gray-300 ml-1">delivery_fee - INT</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="deliveryFee"
                    value={formatPrice(form.deliveryFee)}
                    onChange={handlePriceChange}
                    placeholder="0 원"
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-green-400 pr-8"
                  />
                  <span className="absolute right-3 top-2 text-xs text-gray-400">원</span>
                </div>
                <p className="text-xs text-gray-300 mt-0.5">* 0 입력 시 무료배송</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 상품 이미지 ── */}
        <section className="bg-white rounded-md p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-1">상품 이미지</h3>
          <p className="text-xs text-gray-400 mb-4">
            product_image - image_url / sort_order
          </p>

          {/* 이미지 업로드 영역 */}
          <div
            onClick={() => imageInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-md p-8 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors mb-4"
          >
            <span className="text-2xl mb-2">+</span>
            <p className="text-sm text-gray-400">클릭하여 이미지 업로드</p>
            <p className="text-xs text-gray-300 mt-1">JPG, PNG, 최대 10MB</p>
          </div>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageAdd}
            className="hidden"
          />

          {/* 이미지 미리보기 목록 */}
          {images.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-2">
              {images.map((img, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative w-20 h-20 rounded border-2 overflow-hidden cursor-grab
                    ${index === 0 ? "border-green-500" : "border-gray-200"}
                    ${dragIndex === index ? "opacity-50" : "opacity-100"}
                  `}
                >
                  <img
                    src={img.previewUrl}
                    alt={`이미지 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* 첫 번째 이미지 → 대표 이미지 표시 */}
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-center text-xs py-0.5">
                      대표
                    </div>
                  )}
                  {/* 삭제 버튼 */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleImageRemove(index); }}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-gray-800 bg-opacity-60 text-white rounded-full text-xs flex items-center justify-center hover:bg-opacity-90"
                  >
                    ×
                  </button>
                </div>
              ))}
              {/* 추가 버튼 */}
              <div
                onClick={() => imageInputRef.current?.click()}
                className="w-20 h-20 rounded border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors text-gray-300 text-2xl"
              >
                +
              </div>
            </div>
          )}
          <p className="text-xs text-gray-300 mt-2">
            * 이미지 순서를 드래그로 변경할 수 있습니다. (sort_order) 첫 번째 이미지가 대표 이미지입니다.
          </p>
        </section>

        {/* ── 판매 상태 / 금빛나루 인증 ── */}
        <div className="grid grid-cols-2 gap-5">

          {/* 판매 상태 */}
          <section className="bg-white rounded-md p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-1">판매 상태</h3>
            <p className="text-xs text-gray-400 mb-4">
              sold_status - 0=ACTIVE / 1=HIDDEN / 2=SOLD_OUT
            </p>
            <div className="space-y-3">
              {[
                { value: 0, label: "판매중", desc: "상품 목록에 노출" },
                { value: 1, label: "숨김", desc: "상품 목록에서 노출 안 됨" },
                { value: 2, label: "품절", desc: "품절로 표시 노출" },
              ].map((item) => (
                <label key={item.value} className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="soldStatus"
                    value={item.value}
                    checked={form.soldStatus === item.value}
                    onChange={() => setForm((prev) => ({ ...prev, soldStatus: item.value }))}
                    className="mt-0.5 accent-green-600"
                  />
                  <div>
                    <span className="text-sm text-gray-700">{item.label} ({item.value})</span>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* 금빛나루 인증 */}
          <section className="bg-white rounded-md p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-1">금빛나루 인증</h3>
            <p className="text-xs text-gray-400 mb-4">is_certified - BOOLEAN</p>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isCertified"
                checked={form.isCertified}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 accent-green-600"
              />
              <div>
                <span className="text-sm text-gray-700">김포시 인증 상품</span>
                <p className="text-xs text-gray-400 mt-0.5">
                  체크 시 대표 페이지 상단 노출
                </p>
                <p className="text-xs text-gray-300 mt-0.5">
                  금빛나루 전용관에 노출
                </p>
              </div>
            </label>
          </section>
        </div>

        {/* ── 버튼 ── */}
        <div className="flex justify-end gap-3 pb-6">
          <button
            onClick={() => navigate("/seller/products")}
            className="px-6 py-2.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-green-700 text-white text-sm font-bold rounded hover:bg-green-600 active:bg-green-800 transition-colors"
          >
            저장 · 등록
          </button>
        </div>
      </div>
    </SellerLayout>
  );
}
