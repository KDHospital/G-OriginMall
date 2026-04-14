import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SellerLayout from "../../layouts/SellerLayout";
import axiosInstance from "../../api/axios";
import { BASE_URL } from "../../util/imagesUtil";

const formatPrice = (n) => {
    if (!n && n !== 0) return "";
    return Number(String(n).replace(/[^0-9]/g, "")).toLocaleString("ko-KR");
};
const parsePrice = (str) => parseInt(String(str).replace(/[^0-9]/g, ""), 10) || 0;

export default function SellerProductModifyPage() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const imageInputRef = useRef(null);
    const detailImageInputRef = useRef(null);

    const [categories, setCategories] = useState([]);
    const [selectedParentId, setSelectedParentId] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");

    const parentCategories = categories.filter((c) => c.parentId === null);
    const childCategories = categories.filter((c) => c.parentId === selectedParentId);

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

    const price = parsePrice(form.listPrice) - parsePrice(form.discountPrice);

    // 기존+신규 통합 배열
    // { type: "existing", imageUrl } 또는 { type: "new", file, previewUrl }
    const [allImages, setAllImages] = useState([]);
    const [dragIndex, setDragIndex] = useState(null);

    // 상세 이미지 (sortOrder 10) — 드래그 제외
    const [detailImageUrl, setDetailImageUrl] = useState(null);   // 기존 URL or blob preview
    const [detailImageFile, setDetailImageFile] = useState(null); // 새 파일

    // ── 카테고리 + 상품 데이터 로드 ──────────────
    useEffect(() => {
        axiosInstance.get("/categories")
            .then((res) => setCategories(res.data))
            .catch((err) => console.error("카테고리 로드 실패:", err));
    }, []);

    useEffect(() => {
        axiosInstance.get(`/products/${productId}`)
            .then((res) => {
                const p = res.data;

                const memberData = JSON.parse(localStorage.getItem("member"));


                const sellerId = memberData?.id;
                if (String(p.sellerId) !== String(sellerId)) {
                    alert("본인의 상품만 수정할 수 있습니다.");
                    navigate("/seller/products");
                    return;
                }

                setForm({
                    pname: p.pname ?? "",
                    pdesc: p.pdesc ?? "",
                    listPrice: String(p.listPrice ?? ""),
                    discountPrice: String(p.discountPrice ?? ""),
                    stock: String(p.stock ?? ""),
                    deliveryFee: String(p.deliveryFee ?? ""),
                    soldStatus: p.soldStatus ?? 0,
                    isCertified: p.certified ?? false,
                });

                setSelectedCategoryId(String(p.categoryId));

                // 기존 이미지 → allImages로 통합
                const existing = [];
                if (p.thumbnailImageUrl) {
                    existing.push({ type: "existing", imageUrl: p.thumbnailImageUrl });
                }
                (p.imageUrls || []).forEach((url) => {
                    if (url !== p.thumbnailImageUrl) {
                        existing.push({ type: "existing", imageUrl: url });
                    }
                });
                setAllImages(existing);

                // 상세 이미지 세팅
                if (p.detailImageUrl) {
                    setDetailImageUrl(p.detailImageUrl);
                }
            })
            .catch((err) => console.error("상품 로드 실패:", err));
    }, [productId]);

    useEffect(() => {
        if (!selectedCategoryId || categories.length === 0) return;
        const selected = categories.find((c) => String(c.categoryId) === String(selectedCategoryId));
        if (selected?.parentId) {
            setSelectedParentId(selected.parentId);
        } else {
            setSelectedParentId(parseInt(selectedCategoryId));
        }
    }, [selectedCategoryId, categories]);

    // ── 핸들러 ────────────────────────────────────
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // ── 재고 1 미만 입력 방지 ─────────────────────
        if (name === "stock") {
            const num = Number(value);

            if (num < 1) {
                return;
            }
        }        
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value.replace(/[^0-9]/g, "") }));
    };

    const handleParentCategoryChange = (e) => {
        const parentId = parseInt(e.target.value);
        setSelectedParentId(parentId || null);
        setSelectedCategoryId("");
        const hasChildren = categories.some((c) => c.parentId === parentId);
        if (!hasChildren) setSelectedCategoryId(String(parentId));
    };

    // 이미지 추가 (5개 제한)
    const handleImageAdd = (e) => {
        const files = Array.from(e.target.files);
        const remaining = 5 - allImages.length;
        if (remaining <= 0) {
            alert("이미지는 최대 5개까지 등록 가능합니다.");
            return;
        }
        const added = files.slice(0, remaining).map((file) => ({
            type: "new",
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setAllImages((prev) => [...prev, ...added]);
        e.target.value = "";
    };

    // 이미지 삭제
    const handleImageRemove = (index) => {
        setAllImages((prev) => prev.filter((_, i) => i !== index));
    };

    // 드래그 (allImages 통합 기준)
    const handleDragStart = (index) => setDragIndex(index);
    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (dragIndex === null || dragIndex === index) return;
        const updated = [...allImages];
        const dragged = updated.splice(dragIndex, 1)[0];
        updated.splice(index, 0, dragged);
        setAllImages(updated);
        setDragIndex(index);
    };
    const handleDragEnd = () => setDragIndex(null);

    // 상세 이미지 추가
    const handleDetailImageAdd = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDetailImageUrl(URL.createObjectURL(file));
            setDetailImageFile(file);
        }
        e.target.value = "";
    };

    // 상세 이미지 삭제
    const handleDetailImageRemove = () => {
        setDetailImageUrl(null);
        setDetailImageFile(null);
    };

    // ── 저장 ─────────────────────────────────────
    const handleSubmit = async () => {
        if (!selectedCategoryId) return alert("카테고리를 선택해주세요.");
        if (!form.pname)         return alert("상품명을 입력해주세요.");
        if (!form.listPrice)     return alert("정가를 입력해주세요.");
        if (!form.stock)         return alert("재고 수량을 입력해주세요.");
        if (allImages.length === 0) return alert("대표 이미지가 최소 1장 필요합니다.");

        const formData = new FormData();
        formData.append("categoryId",    selectedCategoryId);
        formData.append("pname",         form.pname);
        formData.append("pdesc",         form.pdesc);
        formData.append("listPrice",     parsePrice(form.listPrice));
        formData.append("discountPrice", parsePrice(form.discountPrice));
        formData.append("price",         price > 0 ? price : 0);
        formData.append("stock",         form.stock);
        formData.append("deliveryFee",   parsePrice(form.deliveryFee));
        formData.append("soldStatus",    Number(form.soldStatus));
        formData.append("certified",     form.isCertified);
        formData.append("exhibition",    false);

        // 통합 순서 기준으로 전송
        allImages.forEach((img, sortOrder) => {
            if (img.type === "existing") {
                formData.append("existingImageUrls", img.imageUrl);
                formData.append("existingImageOrders", sortOrder);
            } else {
                formData.append("images", img.file);
                formData.append("newImageOrders", sortOrder);
            }
        });

        // 상세 이미지
        if (detailImageFile) {
            // 새로 추가한 파일
            formData.append("detailImage", detailImageFile);
        } else if (detailImageUrl) {
            // 기존 URL 유지
            formData.append("detailImageUrl", detailImageUrl);
        }

        try {
            await axiosInstance.put(`/seller/products/${productId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("상품이 수정되었습니다.");
            navigate("/seller/products");
        } catch (err) {
            console.error(err);
            alert("상품 수정에 실패했습니다.");
        }
    };

    return (
        <SellerLayout>
            <h2 className="text-lg font-bold text-gray-700 border-l-4 border-green-500 pl-3 mb-5">
                상품 수정
            </h2>

            <div className="space-y-5">

                {/* ── 기본 정보 ── */}
                <section className="bg-white rounded-md p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 mb-1">기본 정보</h3>
                    <p className="text-xs text-gray-400 mb-4">product 테이블 기준</p>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">
                                카테고리 <span className="text-red-400">*</span>
                            </label>
                            <div className="flex gap-2">
                                <select
                                    value={selectedParentId ?? ""}
                                    onChange={handleParentCategoryChange}
                                    className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-green-400 bg-white"
                                >
                                    <option value="">상위 카테고리 선택</option>
                                    {parentCategories.map((c) => (
                                        <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                                    ))}
                                </select>
                                <select
                                    value={selectedCategoryId}
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                    disabled={!selectedParentId || childCategories.length === 0}
                                    className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-green-400 bg-white disabled:opacity-40"
                                >
                                    <option value="">
                                        {childCategories.length === 0 && selectedParentId ? "하위 카테고리 없음" : "하위 카테고리 선택"}
                                    </option>
                                    {childCategories.map((c) => (
                                        <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">
                                상품명 <span className="text-red-400">*</span>
                                <span className="text-gray-300 ml-1">pname</span>
                            </label>
                            <input
                                type="text" name="pname" value={form.pname}
                                onChange={handleChange} maxLength={100}
                                placeholder="상품명 입력 (최대 100자)"
                                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-400"
                            />
                            <p className="text-xs text-gray-300 text-right mt-0.5">{form.pname.length}/100</p>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">상품 설명</label>
                            <textarea
                                name="pdesc" value={form.pdesc} onChange={handleChange}
                                rows={5} placeholder="상품 설명 입력"
                                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-400 resize-none"
                            />
                        </div>
                    </div>
                </section>

                {/* ── 가격 / 재고 / 배송 ── */}
                <section className="bg-white rounded-md p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">가격 / 재고 / 배송</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">정가 <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <input type="text" name="listPrice" value={formatPrice(form.listPrice)}
                                        onChange={handlePriceChange} placeholder="0 원"
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-400 pr-8" />
                                    <span className="absolute right-3 top-2 text-xs text-gray-400">원</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">할인 금액</label>
                                <div className="relative">
                                    <input type="text" name="discountPrice" value={formatPrice(form.discountPrice)}
                                        onChange={handlePriceChange} placeholder="0 원"
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-400 pr-8" />
                                    <span className="absolute right-3 top-2 text-xs text-gray-400">원</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 text-sm text-gray-600 bg-gray-50 rounded px-4 py-2">
                            <span>판매가 = 정가 − 할인금액</span>
                            <span className="font-bold text-green-600 text-base ml-auto">= {formatPrice(price > 0 ? price : 0)} 원</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">재고 수량 <span className="text-red-400">*</span></label>
                                <input type="number" name="stock" value={form.stock} onChange={handleChange} min={1}
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-400" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">배송비 <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <input type="text" name="deliveryFee" value={formatPrice(form.deliveryFee)}
                                        onChange={handlePriceChange} placeholder="0 원"
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-400 pr-8" />
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
                    <p className="text-xs text-gray-400 mb-4">최대 5장 · 드래그로 순서 변경 · 첫 번째 이미지가 대표</p>

                    <div
                        onClick={() => allImages.length < 5 && imageInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center transition-colors mb-4
                            ${allImages.length < 5
                                ? "border-gray-200 cursor-pointer hover:border-green-400 hover:bg-green-50"
                                : "border-gray-100 bg-gray-50 cursor-not-allowed opacity-50"}`}
                    >
                        <span className="text-2xl mb-2">+</span>
                        <p className="text-sm text-gray-400">
                            {allImages.length < 5 ? "클릭하여 이미지 추가" : "최대 5장 도달"}
                        </p>
                    </div>
                    <input ref={imageInputRef} type="file" accept="image/*" multiple onChange={handleImageAdd} className="hidden" />

                    {allImages.length > 0 && (
                        <div className="flex gap-3 flex-wrap mt-2">
                            {allImages.map((img, index) => (
                                <div key={`img-${index}`}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className={`relative w-20 h-20 rounded border-2 overflow-hidden cursor-grab
                                        ${index === 0 ? "border-green-500" : img.type === "new" ? "border-blue-300" : "border-gray-200"}
                                        ${dragIndex === index ? "opacity-50" : ""}`}
                                >
                                    <img
                                        src={img.type === "existing" ? `${BASE_URL}${img.imageUrl}` : img.previewUrl}
                                        alt="" className="w-full h-full object-cover"
                                    />
                                    {index === 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-center text-xs py-0.5">대표</div>
                                    )}
                                    {img.type === "new" && index !== 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-blue-400 text-white text-center text-xs py-0.5">신규</div>
                                    )}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleImageRemove(index); }}
                                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-gray-800 bg-opacity-60 text-white rounded-full text-xs flex items-center justify-center"
                                    >×</button>
                                </div>
                            ))}

                            {allImages.length < 5 && (
                                <div
                                    onClick={() => imageInputRef.current?.click()}
                                    className="w-20 h-20 rounded border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50 text-gray-300 text-2xl"
                                >+</div>
                            )}
                        </div>
                    )}
                    <p className="text-xs text-gray-300 mt-2">* 파란 테두리 = 새로 추가된 이미지</p>

                    {/* ── 상세 이미지 ── */}
                    <div className="mt-5 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-bold text-gray-700 mb-1">상세 이미지</h4>
                        <p className="text-xs text-gray-400 mb-3">× 삭제 후 재등록 방식 · 드래그 순서 변경 불가</p>

                        <div className="flex gap-3">
                            {detailImageUrl ? (
                                <div className="relative w-20 h-20 rounded border-2 border-orange-300 overflow-hidden">
                                    <img
                                        src={detailImageFile ? detailImageUrl : `${BASE_URL}${detailImageUrl}`}
                                        alt="" className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-orange-400 text-white text-center text-xs py-0.5">상세</div>
                                    <button
                                        onClick={handleDetailImageRemove}
                                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-gray-800 bg-opacity-60 text-white rounded-full text-xs flex items-center justify-center"
                                    >×</button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => detailImageInputRef.current?.click()}
                                    className="w-20 h-20 rounded border-2 border-dashed border-orange-300 flex items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 text-gray-300 text-2xl"
                                >+</div>
                            )}
                        </div>
                        <input ref={detailImageInputRef} type="file" accept="image/*" onChange={handleDetailImageAdd} className="hidden" />
                    </div>
                </section>

                {/* ── 판매 상태 / 금빛나루 인증 ── */}
                <div className="grid grid-cols-2 gap-5">
                    <section className="bg-white rounded-md p-5 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-700 mb-1">판매 상태</h3>
                        <p className="text-xs text-gray-400 mb-4">0=ACTIVE / 1=HIDDEN / 2=SOLD_OUT</p>
                        <div className="space-y-3">
                            {[
                                { value: 0, label: "판매중",  desc: "상품 목록에 노출" },
                                { value: 1, label: "숨김",    desc: "상품 목록에서 노출 안 됨" },
                                { value: 2, label: "품절",    desc: "품절로 표시 노출" },
                            ].map((item) => (
                                <label key={item.value} className="flex items-start gap-2 cursor-pointer">
                                    <input type="radio" name="soldStatus" value={item.value}
                                        checked={form.soldStatus === item.value}
                                        onChange={() => setForm((prev) => ({ ...prev, soldStatus: item.value }))}
                                        className="mt-0.5 accent-green-600" />
                                    <div>
                                        <span className="text-sm text-gray-700">{item.label} ({item.value})</span>
                                        <p className="text-xs text-gray-400">{item.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white rounded-md p-5 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-700 mb-1">금빛나루 인증</h3>
                        <p className="text-xs text-gray-400 mb-4">is_certified - BOOLEAN</p>
                        <label className="flex items-start gap-2 cursor-pointer">
                            <input type="checkbox" name="isCertified" checked={form.isCertified}
                                onChange={handleChange} className="mt-0.5 w-4 h-4 accent-green-600" />
                            <div>
                                <span className="text-sm text-gray-700">김포시 인증 상품</span>
                                <p className="text-xs text-gray-400 mt-0.5">금빛나루 전용관에 노출</p>
                            </div>
                        </label>
                    </section>
                </div>

                {/* ── 버튼 ── */}
                <div className="flex justify-end gap-3 pb-6">
                    <button
                        onClick={() => navigate("/seller/products")}
                        className="px-6 py-2.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2.5 bg-green-700 text-white text-sm font-bold rounded hover:bg-green-600 active:bg-green-800"
                    >
                        수정
                    </button>
                </div>
            </div>
        </SellerLayout>
    );
}