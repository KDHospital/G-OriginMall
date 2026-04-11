import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import AdminLayout from "../../layouts/AdminLayout"
import axiosInstance from "../../api/axios"
import { BASE_URL,getImageUrl } from "../../util/imagesUtil"

// ── 배지 컴포넌트 ────────────────────────────────
const SOLD_STATUS_STYLE = {
    0: "bg-green-100 text-green-600",
    1: "bg-gray-100 text-gray-400",
    2: "bg-red-100 text-red-400",
}
const SOLD_STATUS_LABEL = { 0: "판매중", 1: "숨김", 2: "품절" }

function SoldStatusBadge({ status }) {
    return (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${SOLD_STATUS_STYLE[status] ?? "bg-gray-100 text-gray-400"}`}>
            {SOLD_STATUS_LABEL[status] ?? "-"}
        </span>
    )
}

// ── 메인 컴포넌트 ────────────────────────────────
const AdminProductListPage = () => {
    const navigate = useNavigate()
    const PAGE_SIZE = 10

    // 상품 목록
    const [products, setProducts]         = useState([])
    const [currentPage, setCurrentPage]   = useState(0)
    const [totalPages, setTotalPages]     = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [searchTotal, setSearchTotal]   = useState(null) // 검색 결과 수
    const [loading, setLoading]           = useState(true)
    const [isSearchMode, setIsSearchMode] = useState(false) // 검색 중 여부

    // 카테고리
    const [categories, setCategories]           = useState([])
    const [selectedParentId, setSelectedParentId] = useState(null)
    const [selectedCategoryId, setSelectedCategoryId] = useState("")
    const parentCategories = categories.filter((c) => c.parentId === null)
    const childCategories  = categories.filter((c) => c.parentId === selectedParentId)

    // 검색 입력값
    const [keyword, setKeyword]       = useState("")
    const [sellerName, setSellerName] = useState("")
    const [soldStatus, setSoldStatus] = useState("")
    const [certFilter, setCertFilter] = useState("") // "certified" | "exhibition" | ""

    // 체크박스
    const [checkedIds, setCheckedIds] = useState([])
    const allChecked = products.length > 0 && checkedIds.length === products.length

    // ── 카테고리 로드 ────────────────────────────
    useEffect(() => {
        axiosInstance.get("/categories")
            .then((res) => setCategories(res.data))
            .catch((err) => console.error("카테고리 로드 실패:", err))
    }, [])

    // ── 상품 목록 로드 ───────────────────────────
    const fetchProducts = (page = 0) => {
        setLoading(true)
        // 1. 검색 모드라면 검색 API, 아니면 일반 목록 API 선택
        const url = isSearchMode ? "/admin/products/search" : "/admin/products";

        const params = new URLSearchParams()
        params.append("page",page)
        params.append("size",PAGE_SIZE)

        // 2뎁스가 있으면 2뎁스 ID를, 없으면 1뎁스 ID를 categoryId로 사용
        const categoryToSearch = selectedCategoryId || selectedParentId;

        if (isSearchMode) {
            if (keyword)             params.append("keyword", keyword)
            if (selectedCategoryId && selectedCategoryId !== "") {
                params.append("categoryId", selectedCategoryId);
            }
            if (sellerName)          params.append("sellerName", sellerName)
            if (soldStatus !== null && soldStatus !== "") {
                params.append("soldStatus", soldStatus);
            }
            if (certFilter === "certified")  params.append("certified", true)
            if (certFilter === "exhibition") params.append("exhibition", true)        
                
            if (categoryToSearch) {
                params.append("categoryId", categoryToSearch);
            }                
        }

        axiosInstance.get(`/admin/products/search?${params.toString()}`)
            .then((res) => {
                setProducts(res.data.content)
                setTotalPages(res.data.totalPages)
                setTotalElements(res.data.totalElements)
                setSearchTotal(res.data.totalElements)
                // 검색 모드일 때만 검색 결과 수 표시, 아니면 null
                setSearchTotal(isSearchMode ? res.data.totalElements : null);                
                setCheckedIds([])
            })
            .catch((err) => console.error("데이터 로드, 검색 실패:", err))
            .finally(() => setLoading(false))        
    }

    useEffect(() => {
        fetchProducts(currentPage)
    }, [currentPage, isSearchMode])

    // ── 검색 ─────────────────────────────────────
    const handleSearch = () => {
        setIsSearchMode(true);
        setCurrentPage(0); 
        // 페이지를 0으로 바꾸면 위 useEffect가 트리거되어 fetchProducts(0)이 실행됨
        // 만약 이미 currentPage가 0이라면 useEffect가 안 뜰 수 있으니 수동 호출
        if (currentPage === 0) fetchProducts(0);
    }

    // ── 초기화 ───────────────────────────────────
    const handleReset = () => {
        setKeyword("")
        setSellerName("")
        setSelectedParentId(null)
        setSelectedCategoryId("")
        setSoldStatus("")
        setCertFilter("")
        setIsSearchMode(false); // 검색 모드 해제
        setCurrentPage(0);      // 페이지 초기화
        // 이후 useEffect가 감지해서 fetchProducts(0) [일반목록]을 호출함
    }

    // ── 카테고리 핸들러 ──────────────────────────
    const handleParentCategoryChange = (e) => {
        const parentId = parseInt(e.target.value)
        setSelectedParentId(parentId || null)
        setSelectedCategoryId("")
        const hasChildren = categories.some((c) => c.parentId === parentId)
        if (!hasChildren && parentId) setSelectedCategoryId(String(parentId))
    }

    // ── 체크박스 ─────────────────────────────────
    const handleCheckAll = () => {
        setCheckedIds(allChecked ? [] : products.map((p) => p.productId))
    }
    const handleCheck = (id) => {
        setCheckedIds((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        )
    }

    // ── 선택 숨김처리 ────────────────────────────
    const handleHide = async () => {
        if (checkedIds.length === 0) return alert("항목을 선택해주세요.")
        if (!window.confirm(`${checkedIds.length}개 상품을 숨김 처리하시겠습니까?`)) return
        try {
            await axiosInstance.patch("/admin/products/hide", checkedIds)
            alert("숨김 처리되었습니다.")
            isSearchMode ? handleSearch() : fetchProducts(currentPage)
        } catch (err) {
            alert("처리 실패")
        }
    }

    // ── 선택 삭제 ────────────────────────────────
    const handleDelete = async () => {
        if (checkedIds.length === 0) return alert("항목을 선택해주세요.")
        if (!window.confirm(`${checkedIds.length}개 상품을 삭제하시겠습니까?\n(숨김 처리로 대체됩니다)`)) return
        try {
            await axiosInstance.delete("/admin/products", { data: checkedIds })
            alert("삭제되었습니다.")
            isSearchMode ? handleSearch() : fetchProducts(currentPage)
        } catch (err) {
            alert("삭제 실패")
        }
    }

    return (
        <AdminLayout>
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-700 border-l-4 border-blue-500 pl-3">
                    상품 목록
                </h2>
                <Link
                    to="/admin/products/new"
                    className="px-4 py-2 bg-green-700 text-white text-sm font-bold rounded hover:bg-green-600 transition-colors"
                >
                    + 상품 등록
                </Link>
            </div>

            {/* 검색 필터 */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4 mb-5">
                <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* 상품명 */}
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">상품명</label>
                        <input
                            type="text" value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="상품명 검색"
                            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                        />
                    </div>
                    {/* 판매자명 */}
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">판매자명</label>
                        <input
                            type="text" value={sellerName}
                            onChange={(e) => setSellerName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            placeholder="판매자명 검색"
                            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                    {/* 카테고리 */}
                    <div className="col-span-1">
                        <label className="text-xs text-gray-500 mb-1 block">카테고리</label>
                        <div className="flex gap-2">
                            <select
                                value={selectedParentId ?? ""}
                                onChange={handleParentCategoryChange}
                                className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white"
                            >
                                <option value="">상위 카테고리</option>
                                {parentCategories.map((c) => (
                                    <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                                ))}
                            </select>
                            <select
                                value={selectedCategoryId}
                                onChange={(e) => setSelectedCategoryId(e.target.value)}
                                disabled={!selectedParentId || childCategories.length === 0}
                                className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white disabled:opacity-40"
                            >
                                <option value="">하위 카테고리</option>
                                {childCategories.map((c) => (
                                    <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* 판매 상태 */}
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">판매 상태</label>
                        <select
                            value={soldStatus}
                            onChange={(e) => setSoldStatus(e.target.value)}
                            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white"
                        >
                            <option value="">전체</option>
                            <option value="0">판매중</option>
                            <option value="1">숨김</option>
                            <option value="2">품절</option>
                        </select>
                    </div>
                    {/* 인증 상태 */}
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">인증</label>
                        <select
                            value={certFilter}
                            onChange={(e) => setCertFilter(e.target.value)}
                            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white"
                        >
                            <option value="">전체</option>
                            <option value="certified">금빛나루</option>
                            <option value="exhibition">기획전</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={handleReset}
                        className="px-4 py-2 text-xs border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
                        초기화
                    </button>
                    <button onClick={handleSearch}
                        className="px-4 py-2 text-xs bg-gray-800 text-white rounded hover:bg-gray-700">
                        검색
                    </button>
                </div>
            </div>

            {/* 건수 + 액션 버튼 */}
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400">
                    전체 {totalElements}건
                    {searchTotal !== null && (
                        <span className="ml-2 text-blue-500 font-medium">검색결과 {searchTotal}건</span>
                    )}
                </p>
                <div className="flex gap-2">
                    <button onClick={handleHide}
                        disabled={checkedIds.length === 0}
                        className="px-3 py-1.5 text-xs border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                        선택 숨김처리
                    </button>
                    <button onClick={handleDelete}
                        disabled={checkedIds.length === 0}
                        className="px-3 py-1.5 text-xs border border-red-300 text-red-500 rounded hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed">
                        선택 삭제
                    </button>
                </div>
            </div>

            {/* 테이블 */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 text-sm text-gray-400">상품이 없습니다.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
                                <th className="p-3 w-8">
                                    <input type="checkbox" checked={allChecked} onChange={handleCheckAll}
                                        className="w-4 h-4 accent-gray-700 cursor-pointer" />
                                </th>
                                <th className="p-3 text-center font-medium w-12">No</th>
                                <th className="p-3 text-center font-medium w-16">이미지</th>
                                <th className="p-3 text-left font-medium">상품명</th>
                                <th className="p-3 text-center font-medium">카테고리</th>
                                <th className="p-3 text-center font-medium">판매자</th>
                                <th className="p-3 text-right font-medium">판매가</th>
                                <th className="p-3 text-center font-medium">재고</th>
                                <th className="p-3 text-center font-medium">인증</th>
                                <th className="p-3 text-center font-medium">상태</th>
                                <th className="p-3 text-center font-medium">등록일</th>
                                <th className="p-3 text-center font-medium">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={product.productId}
                                    className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                                    {/* 체크박스 */}
                                    <td className="p-3 text-center">
                                        <input type="checkbox"
                                            checked={checkedIds.includes(product.productId)}
                                            onChange={() => handleCheck(product.productId)}
                                            className="w-4 h-4 accent-gray-700 cursor-pointer" />
                                    </td>
                                    {/* No */}
                                    <td className="p-3 text-center text-xs text-gray-400">
                                        {totalElements - (currentPage * PAGE_SIZE) - index}
                                    </td>
                                    {/* 이미지 */}
                                    <td className="p-3 text-center">
                                        <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 overflow-hidden mx-auto">
                                            {product.thumbnailImageUrl ? (
                                                <img
                                                    src={`${getImageUrl(product.thumbnailImageUrl)}`}
                                                    alt={product.pname}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">No</div>
                                            )}
                                        </div>
                                    </td>
                                    {/* 상품명 */}
                                    <td className="p-3">
                                        <p className="font-medium text-gray-800 truncate max-w-[180px]">{product.pname}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">No.{product.productId}</p>
                                    </td>
                                    {/* 카테고리 */}
                                    <td className="p-3 text-center text-xs text-gray-500">{product.categoryName}</td>
                                    {/* 판매자 */}
                                    <td className="p-3 text-center text-xs text-gray-500">{product.sellerName}</td>
                                    {/* 판매가 */}
                                    <td className="p-3 text-right whitespace-nowrap">
                                        <p className="font-medium text-gray-800">{product.price?.toLocaleString("ko-KR")}원</p>
                                        {product.discountPrice > 0 && (
                                            <p className="text-xs text-gray-400 line-through">{product.listPrice?.toLocaleString("ko-KR")}원</p>
                                        )}
                                    </td>
                                    {/* 재고 */}
                                    <td className={`p-3 text-center font-medium text-sm ${product.stock === 0 ? "text-red-400" : "text-gray-700"}`}>
                                        {product.stock}
                                    </td>
                                    {/* 인증 */}
                                    <td className="p-3 text-center">
                                        <div className="flex flex-col gap-1 items-center">
                                            {product.certified && (
                                                <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-600 rounded-full">금빛나루</span>
                                            )}
                                            {product.exhibition && (
                                                <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded-full">기획전</span>
                                            )}
                                            {!product.certified && !product.exhibition && (
                                                <span className="text-xs text-gray-300">-</span>
                                            )}
                                        </div>
                                    </td>
                                    {/* 상태 */}
                                    <td className="p-3 text-center">
                                        <SoldStatusBadge status={product.soldStatus} />
                                    </td>
                                    {/* 등록일 */}
                                    <td className="p-3 text-center text-xs text-gray-400 whitespace-nowrap">
                                        {product.createdAt?.replace("T", " ").slice(0, 10)}
                                    </td>
                                    {/* 관리 */}
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => navigate(`/admin/products/${product.productId}/edit`)}
                                            className="text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                        >
                                            수정
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-6">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                        className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        이전
                    </button>
                    {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                        const start = Math.floor(currentPage / 10) * 10
                        const pageNum = start + i
                        if (pageNum >= totalPages) return null
                        return (
                            <button key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-1.5 text-xs border rounded transition-colors ${
                                    currentPage === pageNum
                                        ? "bg-gray-800 text-white border-gray-800"
                                        : "border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                {pageNum + 1}
                            </button>
                        )
                    })}
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        다음
                    </button>
                </div>
            )}
        </AdminLayout>
    )
}
export default AdminProductListPage