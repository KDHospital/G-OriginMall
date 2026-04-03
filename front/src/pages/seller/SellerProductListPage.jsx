import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SellerLayout from "../../layouts/SellerLayout";
import axiosInstance from "../../api/axios";
import { BASE_URL } from "../../util/imagesUtil";

// ─────────────────────────────────────────
// 판매 상태 배지
// ─────────────────────────────────────────
const SOLD_STATUS_STYLE = {
    0: "bg-green-100 text-green-600",
    1: "bg-gray-100 text-gray-400",
    2: "bg-red-100 text-red-400",
};

const SOLD_STATUS_LABEL = {
    0: "판매중",
    1: "숨김",
    2: "품절",
};

function SoldStatusBadge({ status }) {
    return (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${SOLD_STATUS_STYLE[status] ?? "bg-gray-100 text-gray-400"}`}>
            {SOLD_STATUS_LABEL[status] ?? "-"}
        </span>
    );
}

// ─────────────────────────────────────────
// SellerProductListPage
// ─────────────────────────────────────────
export default function SellerProductListPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);

    const PAGE_SIZE = 10;

    useEffect(() => {
        setLoading(true);
        axiosInstance.get(`/seller/products?page=${currentPage}&size=${PAGE_SIZE}`)
            .then((res) => {
                setProducts(res.data.content);
                setTotalPages(res.data.totalPages);
                setTotalElements(res.data.totalElements);
            })
            .catch((err) => console.error("상품 목록 로드 실패:", err))
            .finally(() => setLoading(false));
    }, [currentPage]);

    return (
        <SellerLayout>
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-700 border-l-4 border-green-500 pl-3">
                    내 상품 목록
                </h2>
                <Link
                    to="/seller/products/new"
                    className="px-4 py-2 bg-green-700 text-white text-sm font-bold rounded hover:bg-green-600 transition-colors"
                >
                    + 상품 등록
                </Link>
            </div>

            <p className="text-xs text-gray-400 mb-3">전체 {totalElements}개</p>

            {/* 상품 목록 */}
            <div className="bg-white rounded-md shadow-sm border border-gray-100">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 text-sm text-gray-400">
                        등록된 상품이 없습니다.
                        <div className="mt-3">
                            <Link
                                to="/seller/products/new"
                                className="text-green-600 font-medium hover:underline"
                            >
                                첫 상품을 등록해보세요 →
                            </Link>
                        </div>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
                                <th className="p-4 text-left font-medium">상품정보</th>
                                <th className="p-4 text-center font-medium">카테고리</th>
                                <th className="p-4 text-right font-medium">판매가</th>
                                <th className="p-4 text-center font-medium">재고</th>
                                <th className="p-4 text-center font-medium">상태</th>
                                <th className="p-4 text-center font-medium">금빛나루</th>
                                <th className="p-4 text-center font-medium">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.productId} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                                    {/* 상품정보 */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex-shrink-0 overflow-hidden">
                                                {product.thumbnailImageUrl ? (
                                                    <img
                                                        src={`${BASE_URL}${product.thumbnailImageUrl}`}
                                                        alt={product.pname}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">No</div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 truncate max-w-[200px]">
                                                    {product.pname}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    No. {product.productId}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    {/* 카테고리 */}
                                    <td className="p-4 text-center text-xs text-gray-500">
                                        {product.categoryName}
                                    </td>
                                    {/* 판매가 */}
                                    <td className="p-4 text-right whitespace-nowrap">
                                        <p className="font-medium text-gray-800">
                                            {product.price?.toLocaleString("ko-KR")}원
                                        </p>
                                        {product.discountPrice > 0 && (
                                            <p className="text-xs text-gray-400 line-through">
                                                {product.listPrice?.toLocaleString("ko-KR")}원
                                            </p>
                                        )}
                                    </td>
                                    {/* 재고 */}
                                    <td className={`p-4 text-center font-medium ${product.stock === 0 ? "text-red-400" : "text-gray-700"}`}>
                                        {product.stock}
                                    </td>
                                    {/* 판매 상태 */}
                                    <td className="p-4 text-center">
                                        <SoldStatusBadge status={product.soldStatus} />
                                    </td>
                                    {/* 금빛나루 인증 */}
                                    <td className="p-4 text-center">
                                        {product.certified ? (
                                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full font-medium">인증</span>
                                        ) : (
                                            <span className="text-xs text-gray-300">-</span>
                                        )}
                                    </td>
                                    {/* 관리 */}
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => navigate(`/seller/products/${product.productId}/edit`)}
                                                className="text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 transition-colors whitespace-nowrap"
                                            >
                                                수정
                                            </button>
                                        </div>
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
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`px-3 py-1.5 text-xs border rounded transition-colors ${
                                currentPage === i
                                    ? "bg-green-700 text-white border-green-700"
                                    : "border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        다음
                    </button>
                </div>
            )}
        </SellerLayout>
    );
}