import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getBanner,updateBanner } from "../../api/bannerApi"
import AdminLayout from "../../layouts/AdminLayout"
import { getImageUrl } from "../../util/imagesUtil"


const AdminBannerEdit = () => {
    const navigate = useNavigate()
    const { bannerId } = useParams()

    // ── 상태 ──────────────────────────────────
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const [originalImageUrl, setOriginalImageUrl] = useState("")
    const [imageFile, setImageFile] = useState(null)
    const [preview, setPreview] = useState(null)

    const [form, setForm] = useState({
        linkUrl: "",
        sortOrder: "",
        isActive: true,
    })

    const imageInputRef = useRef(null)

    // ── 기존 데이터 로드 ──────────────────────
    useEffect(() => {
        getBanner(bannerId)
            .then((res) => {
                const data = res.data
                setOriginalImageUrl(data.imageUrl || "")
                setPreview(data.imageUrl || null)
                setForm({
                    linkUrl: data.linkUrl || "",
                    sortOrder: data.sortOrder ?? "",
                    isActive: data.isActive,
                })
            })
            .catch((err) => {
                console.error(err)
                alert("배너 정보를 불러오지 못했습니다.")
                navigate("/admin/banner")
            })
            .finally(() => setLoading(false))
    }, [bannerId, navigate])    
   // ── 이미지 선택 ───────────────────────────
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setImageFile(file)
        setPreview(URL.createObjectURL(file))
        e.target.value = ""
    }

    const handleImageDrop = (e) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (!file) return
        setImageFile(file)
        setPreview(URL.createObjectURL(file))
    }

    // ── 폼 입력 ───────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    // ── 수정 저장 ─────────────────────────────
    const handleSubmit = async () => {
        if (!form.sortOrder) return alert("노출 순서를 입력해주세요.")

        const formData = new FormData()
        if (imageFile) {
            formData.append("imageFile", imageFile)
        }
        formData.append(
            "data",
            new Blob(
                [
                    JSON.stringify({
                        imageUrl: originalImageUrl,
                        linkUrl: form.linkUrl,
                        sortOrder: Number(form.sortOrder),
                        isActive: form.isActive,
                    }),
                ],
                { type: "application/json" }
            )
        )

        setSubmitting(true)
        try {
            await updateBanner(bannerId, formData)
            alert("배너가 수정되었습니다.")
            navigate("/admin/banner")
        } catch (err) {
            console.error(err)
            alert("배너 수정에 실패했습니다.")
        } finally {
            setSubmitting(false)
        }
    }
    return(
        <AdminLayout>
            {/* 페이지 타이틀 */}
            <h2 className="text-lg font-bold text-gray-700 border-l-4 border-blue-500 pl-3 mb-5">
                배너 수정
            </h2>        

            {loading ? (
                <p className="text-sm text-gray-400 py-10 text-center">불러오는 중...</p>
            ) : (
                <div className="space-y-5">
                    <section className="bg-white rounded-md p-5 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-700 mb-1">배너 정보 수정</h3>
                        <p className="text-xs text-gray-400 mb-4">
                            banner 테이블 · image_url / link_url / sort_order / is_active
                        </p>

                        <div className="grid grid-cols-2 gap-6">

                            {/* 이미지 */}
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">
                                    배너 이미지
                                    <span className="text-gray-300 ml-1">image_url</span>
                                </label>
                                <div
                                    onDrop={handleImageDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    onClick={() => imageInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-200 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors overflow-hidden"
                                    style={{ minHeight: 160 }}
                                >
                                    {preview ? (
                                        <img
                                            src={`${getImageUrl(preview)}`}
                                            alt="미리보기"
                                            className="w-full object-contain max-h-48"
                                        />
                                    ) : (
                                        <>
                                            <span className="text-2xl mb-2 text-gray-300">+</span>
                                            <p className="text-sm text-gray-400">
                                                클릭하여 이미지 업로드
                                            </p>
                                            <p className="text-xs text-gray-300 mt-1">
                                                권장 사이즈 1280 × 400px · JPG, PNG
                                            </p>
                                        </>
                                    )}
                                </div>
                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                {imageFile ? (
                                    <p className="text-xs text-green-600 mt-1">
                                        새 파일 선택됨: {imageFile.name}
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-300 mt-1 truncate">
                                        현재: {originalImageUrl || "없음"}
                                    </p>
                                )}
                            </div>

                            {/* 우측 입력 */}
                            <div className="flex flex-col gap-4">

                                {/* 클릭 링크 URL */}
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">
                                        클릭 링크 URL
                                        <span className="text-gray-300 ml-1">link_url</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="linkUrl"
                                        value={form.linkUrl}
                                        onChange={handleChange}
                                        placeholder="/event/spring-2026  (내부 경로 또는 외부 URL)"
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-blue-400"
                                    />
                                    <p className="text-xs text-gray-300 mt-0.5">
                                        * 비워두면 클릭 시 이동 없음
                                    </p>
                                </div>

                                {/* 노출 순서 */}
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">
                                        노출 순서 <span className="text-red-400">*</span>
                                        <span className="text-gray-300 ml-1">sort_order · INT</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="sortOrder"
                                        value={form.sortOrder}
                                        onChange={handleChange}
                                        min={1}
                                        max={3}
                                        placeholder="1"
                                        className="w-24 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-blue-400"
                                    />
                                    <p className="text-xs text-gray-300 mt-0.5">
                                        * 숫자가 낮을수록 먼저 노출
                                    </p>
                                </div>

                                {/* 노출 여부 */}
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">
                                        노출 여부
                                        <span className="text-gray-300 ml-1">is_active · TINYINT(1)</span>
                                    </label>
                                    <div className="flex gap-5 mt-1">
                                        <label className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
                                            <input
                                                type="radio"
                                                name="isActive"
                                                checked={form.isActive === true}
                                                onChange={() =>
                                                    setForm((prev) => ({ ...prev, isActive: true }))
                                                }
                                                className="accent-blue-500"
                                            />
                                            노출 (1)
                                        </label>
                                        <label className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
                                            <input
                                                type="radio"
                                                name="isActive"
                                                checked={form.isActive === false}
                                                onChange={() =>
                                                    setForm((prev) => ({ ...prev, isActive: false }))
                                                }
                                                className="accent-blue-500"
                                            />
                                            숨김 (0)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── 버튼 ── */}
                    <div className="flex justify-end gap-3 pb-6">
                        <button
                            onClick={() => navigate("/admin/banner")}
                            className="px-6 py-2.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-500 active:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {submitting ? "저장 중..." : "수정 완료"}
                        </button>
                    </div>
                </div>
            )}                
        </AdminLayout>
    )
}
export default AdminBannerEdit