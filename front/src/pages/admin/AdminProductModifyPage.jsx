import { useState, useRef,useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AdminLayout from "../../layouts/AdminLayout"
import axiosInstance from "../../api/axios"
import { getImageUrl } from "../../util/imagesUtil"

const formatPrice = (n) => {
    if (!n && n !== 0) return "";
    return Number(String(n).replace(/[^0-9]/g, "")).toLocaleString("ko-KR");
};
const parsePrice = (str) => parseInt(String(str).replace(/[^0-9]/g, ""), 10) || 0;

const AdminProductModifyPage = () => {

    //주소 저장용
    const navigate = useNavigate();
    //파라미터 저장용
    const { productId } = useParams(); // /admin/products/:productId/edit
    //React에서 렌더링을 유발하지 않고 지속되는 값을 저장하거나, DOM 요소에 직접 접근할 때 사용하는 훅
    const imageInputRef = useRef(null);
    //카테고리 저장
    const [categories, setCategories] = useState([]);
    //셀렉트의 부모(1뎁스) 저장
    const [selectedParentId, setSelectedParentId] = useState(null);
    //셀렉트의 부모(2뎁스) 저장
    const [selectedCategoryId, setSelectedCategoryId] = useState("");

    const parentCategories = categories.filter((c) => c.parentId === null);
    const childCategories = categories.filter((c) => c.parentId === selectedParentId);
    //기본 폼(입력필요값)
    const [form, setForm] = useState({
        pname: "",
        pdesc: "",
        listPrice: "",
        discountPrice: "",
        stock: "",
        deliveryFee: "",
        soldStatus: 0,
        isCertified: false,
        isExhibition: false
    });
    //price 계산
    const price = parsePrice(form.listPrice) - parsePrice(form.discountPrice);

    // 기존 이미지 URL (서버에 저장된 것)
    const [existingImages, setExistingImages] = useState([]); // [{ imageUrl, productImageId }]
    // 새로 추가한 이미지 파일
    const [newImages, setNewImages] = useState([]); // [{ file, previewUrl }]
    const [dragIndex, setDragIndex] = useState(null);

    // ── 카테고리 + 상품 데이터 로드 ──────────────
    useEffect(() => {
        // 카테고리 먼저 로드
        axiosInstance.get("/categories")
            .then((res) => setCategories(res.data))
            .catch((err) => console.error("카테고리 로드 실패:", err));
    }, []);

    useEffect(() => {
        // 상품 상세 데이터 로드
        axiosInstance.get(`/products/${productId}`)
            .then((res) => {
                const p = res.data;
                setForm({
                    pname: p.pname ?? "",
                    pdesc: p.pdesc ?? "",
                    listPrice: String(p.listPrice ?? ""),
                    discountPrice: String(p.discountPrice ?? ""),
                    stock: String(p.stock ?? ""),
                    deliveryFee: String(p.deliveryFee ?? ""),
                    soldStatus: p.soldStatus ?? 0,
                    isCertified: !!p.certified, 
                    isExhibition: !!p.exhibition,
                });
                
                // 카테고리 선택 상태 복원
                setSelectedCategoryId(String(p.categoryId));

                // 기존 이미지 세팅
                // thumbnailImageUrl을 맨 앞에, imageUrls를 뒤에
                const existing = [];
                if (p.thumbnailImageUrl) {
                    existing.push({ imageUrl: p.thumbnailImageUrl, isThumbnail: true });
                }
                (p.imageUrls || []).forEach((url) => {
                    if (url !== p.thumbnailImageUrl) {
                        existing.push({ imageUrl: url, isThumbnail: false });
                    }
                });
                setExistingImages(existing);
            })
            .catch((err) => console.error("상품 로드 실패:", err));
    }, [productId]);

    // 카테고리 복원 — categories 로드 후 parentId 세팅
    useEffect(() => {
        if (!selectedCategoryId || categories.length === 0) return;
        const selected = categories.find((c) => String(c.categoryId) === String(selectedCategoryId));
        if (selected?.parentId) {
            setSelectedParentId(selected.parentId);
        } else {
            // 최상위 카테고리인 경우
            setSelectedParentId(parseInt(selectedCategoryId));
        }
    }, [selectedCategoryId, categories]);

    // ── 핸들러 ────────────────────────────────────
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
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

    // 기존 이미지 삭제
    const handleExistingImageRemove = (index) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    // 새 이미지 추가
    const handleImageAdd = (e) => {
        const files = Array.from(e.target.files);
        const added = files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
        setNewImages((prev) => [...prev, ...added]);
        e.target.value = "";
    };

    // 새 이미지 삭제
    const handleNewImageRemove = (index) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    // 드래그 (기존 + 새 이미지 통합 순서 변경은 복잡하므로 새 이미지 내에서만)
    const handleDragStart = (index) => setDragIndex(index);
    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (dragIndex === null || dragIndex === index) return;
        const updated = [...newImages];
        const dragged = updated.splice(dragIndex, 1)[0];
        updated.splice(index, 0, dragged);
        setNewImages(updated);
        setDragIndex(index);
    };
    const handleDragEnd = () => setDragIndex(null);

    // ── 저장 ─────────────────────────────────────
    const handleSubmit = async () => {
        if (!selectedCategoryId) return alert("카테고리를 선택해주세요.");
        if (!form.pname)         return alert("상품명을 입력해주세요.");
        if (!form.listPrice)     return alert("정가를 입력해주세요.");
        if (!form.stock)         return alert("재고 수량을 입력해주세요.");
        if (existingImages.length === 0 && newImages.length === 0)
            return alert("대표 이미지가 최소 1장 필요합니다.");

        const formData = new FormData();
        formData.append("categoryId",    selectedCategoryId);
        formData.append("pname",         form.pname);
        formData.append("pdesc",         form.pdesc);
        formData.append("listPrice",     parsePrice(form.listPrice));
        formData.append("discountPrice", parsePrice(form.discountPrice));
        formData.append("price",         price > 0 ? price : 0);
        formData.append("stock",         form.stock);
        formData.append("deliveryFee",   parsePrice(form.deliveryFee));
        formData.append("soldStatus", Number(form.soldStatus));
        formData.append("certified", form.isCertified); 
        formData.append("exhibition", form.isExhibition);

        // 기존 이미지 중 남긴 것들의 URL 전달 (백엔드에서 기존 이미지 유지 판단용)
        existingImages.forEach((img) => formData.append("existingImageUrls", img.imageUrl));

        // 새 이미지 파일 추가
        newImages.forEach((img) => formData.append("images", img.file));

        try {
            await axiosInstance.put(`/admin/products/${productId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("상품이 수정되었습니다.");
            navigate("/admin/products");
        } catch (err) {
            console.error(err);
            alert("상품 수정에 실패했습니다.");
        }
    };

    // 전체 이미지 수 (기존 + 신규)
    const totalImageCount = existingImages.length + newImages.length;



    return(
        <AdminLayout>
            {/* 헤더 */}
                <h2 className="text-lg font-bold text-gray-700 border-l-4 border-blue-500 pl-3 mb-5">
                    상품 수정
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

                        {/* 상품명 */}
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

                        {/* 상품 설명 */}
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
                    <p className="text-xs text-gray-400 mb-4">기존 이미지 × 버튼으로 삭제, 새 이미지 추가 가능</p>

                    <div
                        onClick={() => imageInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-200 rounded-md p-8 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors mb-4"
                    >
                        <span className="text-2xl mb-2">+</span>
                        <p className="text-sm text-gray-400">클릭하여 이미지 추가</p>
                    </div>
                    <input ref={imageInputRef} type="file" accept="image/*" multiple onChange={handleImageAdd} className="hidden" />

                    {totalImageCount > 0 && (
                        <div className="flex gap-3 flex-wrap mt-2">
                            {/* 기존 이미지 */}
                            {existingImages.map((img, index) => (
                                <div key={`existing-${index}`} className={`relative w-20 h-20 rounded border-2 overflow-hidden
                                    ${index === 0 && newImages.length === 0 ? "border-green-500" : "border-gray-200"}`}>
                                    <img src={`${getImageUrl(img.imageUrl)}`} alt="" className="w-full h-full object-cover" />
                                    {index === 0 && newImages.length === 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-center text-xs py-0.5">대표</div>
                                    )}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleExistingImageRemove(index); }}
                                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-gray-800 bg-opacity-60 text-white rounded-full text-xs flex items-center justify-center"
                                    >×</button>
                                </div>
                            ))}

                            {/* 새 이미지 */}
                            {newImages.map((img, index) => (
                                <div key={`new-${index}`}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className={`relative w-20 h-20 rounded border-2 overflow-hidden cursor-grab
                                        ${existingImages.length === 0 && index === 0 ? "border-green-500" : "border-blue-300"}
                                        ${dragIndex === index ? "opacity-50" : ""}`}
                                >
                                    <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
                                    {existingImages.length === 0 && index === 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-center text-xs py-0.5">대표</div>
                                    )}
                                    {existingImages.length > 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-blue-400 text-white text-center text-xs py-0.5">신규</div>
                                    )}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleNewImageRemove(index); }}
                                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-gray-800 bg-opacity-60 text-white rounded-full text-xs flex items-center justify-center"
                                    >×</button>
                                </div>
                            ))}

                            <div
                                onClick={() => imageInputRef.current?.click()}
                                className="w-20 h-20 rounded border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50 text-gray-300 text-2xl"
                            >+</div>
                        </div>
                    )}
                    <p className="text-xs text-gray-300 mt-2">* 파란 테두리 = 새로 추가된 이미지</p>
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
                    {/* 금빛나루 인증 */}
                    <section className="bg-white rounded-md p-5 shadow-sm">
                        <div className="mb-4">
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
                        </div>

                        {/* 기획전 등록 */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 mb-1">기획전 등록</h3>
                            <p className="text-xs text-gray-400 mb-4">is_exhibition - BOOLEAN</p>
                            <label className="flex items-start gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isExhibition"
                                checked={form.isExhibition}
                                onChange={handleChange}
                                className="mt-0.5 w-4 h-4 accent-green-600"
                            />
                            <div>
                                <span className="text-sm text-gray-700">기획전 등록 상품</span>
                                <p className="text-xs text-gray-400 mt-0.5">
                                체크 시 대표 페이지 상단 노출
                                </p>
                                <p className="text-xs text-gray-300 mt-0.5">
                                기획전 전용관에 노출
                                </p>
                            </div>
                            </label>
                        </div>            
                    </section>                    
                </div>

                {/* ── 버튼 ── */}
                <div className="flex justify-end gap-3 pb-6">
                    <button
                        onClick={() => navigate("/admin/products")}
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

        </AdminLayout>
    )
}
export default AdminProductModifyPage