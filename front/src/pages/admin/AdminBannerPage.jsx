import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { 
    getBannerList, 
    createBanner,
    deleteBanner,
    toggleActive,
    updateBannerOrder
} from "../../api/bannerApi"
import AdminLayout from "../../layouts/AdminLayout"
import { getImageUrl } from "../../util/imagesUtil"


const AdminBannerPage = () => {
    const navigate = useNavigate()
    // ── 목록 상태 ─────────────────────────────
    const [banners, setBanners] = useState([])
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState(null)
    const [confirmId, setConfirmId] = useState(null)
    const dragFrom = useRef(null)

    // ── 등록 폼 상태 ──────────────────────────
    const [imageFile, setImageFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [form, setForm] = useState({
        linkUrl: "",
        sortOrder: "",
        isActive: true,
    })
    const [submitting, setSubmitting] = useState(false)
    const imageInputRef = useRef(null)

    // ── 토스트 표시 ─────────────────────────────
    const showToast = useCallback((msg, type = "success")=>{
        setToast({message: msg, type})
        setTimeout(()=>setToast(null),3000)
    },[])

    // ── 배너 목록 조회 ───────────────────────────
    const loadBanners = useCallback(async()=>{
        try {
            const res = await getBannerList()
            setBanners(res.data)
            console.log(res.data)
        } catch (err) {
            showToast("배너 조회 실패","err")
        } finally {
            setLoading(false)
        }
    },[showToast])

    useEffect(()=>{
        loadBanners()
    },[loadBanners])

    // 등록 시 sortOrder 기본값 설정
    useEffect(() => {
        setForm((prev) => ({ ...prev, sortOrder: banners.length + 1 }))
    }, [banners.length])

    // ── 드래그 앤 드롭 ────────────────────────
    const handleDragStart = (index) => {
        dragFrom.current = index
    }

    // ── 드래그 중 순서 변경 ─────────────────────
    const handleDragOver = (index) => {
        if (dragFrom.current === index) return

        const newList = [...banners]
        const dragged = newList.splice(dragFrom.current, 1)[0]
        newList.splice(index, 0, dragged)

        dragFrom.current = index
        setBanners(newList)
    }

    // ── 드롭 시 순서 저장 ───────────────────────
    const handleDrop = async () => {
        try {
            const ids = banners.map(b => b.bannerId)
            await updateBannerOrder(ids)
            showToast("순서 변경 완료")
            loadBanners()
        } catch (err) {
            showToast("순서 변경 실패", "error")
        }
    }

    // ── 배너 노출 토글 ─────────────────────────
    const handleToggle = async (id) => {
        try {
            await toggleActive(id)
            setBanners(prev =>
                prev.map(b =>
                    b.bannerId === id ? { ...b, isActive: !b.isActive } : b
                )
            )
            
            showToast("노출상태 변경에 성공하였습니다.")
        } catch (err) {
            console.error(err)
            showToast("노출 상태 변경에 실패했습니다.", "error")
        }
    }
    // ── 삭제 ──────────────────────────────────    
    const handleDelete = async () => {
        try {
            await deleteBanner(confirmId)
            console.log("삭제 요청 ID:", confirmId)
            setConfirmId(null)
            showToast("배너가 삭제되었습니다.")
            loadBanners()
        } catch (err) {
            console.error(err)
            showToast("삭제에 실패했습니다.", "error")
            setConfirmId(null)
        }
    }

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

    // ── 배너 등록 ─────────────────────────────
    const handleSubmit = async () => {
        if (!imageFile) return alert("배너 이미지를 선택해주세요.")
        if (banners.length >= 3) return alert("배너는 최대 3개까지 등록 가능합니다.")
        if (!form.sortOrder) return alert("노출 순서를 입력해주세요.")

        const formData = new FormData()
        formData.append("imageFile", imageFile)
        formData.append(
            "data",
            new Blob(
                [
                    JSON.stringify({
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
            await createBanner(formData)
            alert("배너가 등록되었습니다.")
            // 폼 초기화
            setImageFile(null)
            setPreview(null)
            setForm({ linkUrl: "", sortOrder: "", isActive: true })
            loadBanners()
        } catch (err) {
            console.error(err)
            alert("배너 등록에 실패했습니다.")
        } finally {
            setSubmitting(false)
        }
    }

    return(
        <AdminLayout>
            {/* 페이지 타이틀 */}
            <h2 className="text-lg font-bold text-gray-700 border-l-4 border-blue-500 pl-3 mb-5">
                배너 관리
            </h2>

            <div className="space-y-5">

                {/* ── 등록 배너 목록 ── */}
                <section className="bg-white rounded-md p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-bold text-gray-700">
                            등록 배너 목록
                            <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                {banners.length} / 3
                            </span>
                        </h3>
                        <span className="text-xs text-gray-400">
                            banner 테이블 · sort_order 순서로 메인 슬라이더에 노출
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-4">
                        banner 테이블 기준
                    </p>

                    {/* 안내 문구 */}
                    <div className="bg-blue-50 border-l-4 border-blue-400 rounded px-4 py-2.5 mb-4">
                        <p className="text-xs text-blue-600 leading-relaxed">
                            · ≡ 핸들을 드래그하여 순서(sort_order)를 변경할 수 있습니다.<br />
                            · 노출 토글로 is_active를 즉시 변경합니다. (1=노출 / 0=숨김)
                        </p>
                    </div>

                    {/* 로딩 */}
                    {loading && (
                        <p className="text-sm text-gray-400 text-center py-8">불러오는 중...</p>
                    )}

                    {/* 배너 없음 */}
                    {!loading && banners.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-8">
                            등록된 배너가 없습니다.
                        </p>
                    )}

                    {/* 배너 행 */}
                    {!loading &&
                        banners.map((banner, index) => (
                            <div
                                key={banner.bannerId}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => {
                                    e.preventDefault()
                                    handleDragOver(index)
                                }}
                                onDrop={handleDrop}
                                className="flex items-center gap-4 border border-gray-200 rounded-md px-4 py-3 mb-2 bg-white hover:bg-gray-50 cursor-grab transition-colors"
                            >
                                {/* 드래그 핸들 + 순서 번호 */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-gray-300 text-lg select-none">⠿</span>
                                    <span className="text-xs font-bold text-gray-400 bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center">
                                        {index + 1}
                                    </span>
                                </div>

                                {/* 썸네일 */}
                                <div className="w-28 h-16 rounded border border-gray-200 overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                                    {banner.imageUrl ? (
                                        <img
                                            src={`${getImageUrl(banner.imageUrl)}`}
                                            alt={`배너 ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xs text-gray-300">이미지 없음</span>
                                    )}
                                </div>

                                {/* URL 정보 */}
                                <div className="flex-1 min-w-0 space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded shrink-0">
                                            image_url
                                        </span>
                                        <span className="text-xs text-blue-500 truncate">
                                            {banner.imageUrl || "—"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded shrink-0">
                                            link_url
                                        </span>
                                        <span className="text-xs text-blue-500 truncate">
                                            {banner.linkUrl || "—"}
                                        </span>
                                    </div>
                                </div>

                                {/* 노출 토글 */}
                                <div className="flex flex-col items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => handleToggle(banner.bannerId)}
                                        className={`relative w-11 h-6 rounded-full transition-colors ${
                                            banner.getActive ? "bg-green-500" : "bg-gray-300"
                                        }`}
                                    >
                                        <span
                                            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                                                banner.getActive ? "left-6" : "left-1"
                                            }`}
                                        />
                                    </button>
                                    <span
                                        className={`text-xs font-semibold ${
                                            banner.getActive ? "text-green-600" : "text-gray-400"
                                        }`}
                                    >
                                        {banner.isActive ? "노출중" : "숨김"}
                                    </span>
                                    <span className="text-xs text-gray-300">
                                        is_active = {banner.getActive ? 1 : 0}
                                    </span>
                                </div>

                                {/* 수정 / 삭제 버튼 */}
                                <div className="flex flex-col gap-1.5 shrink-0">
                                    <button
                                        onClick={() =>
                                            navigate(`/admin/banner/${banner.bannerId}/edit`)
                                        }
                                        className="px-4 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded hover:bg-blue-600 transition-colors"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => setConfirmId(banner.bannerId)}
                                        className="px-4 py-1.5 bg-red-500 text-white text-xs font-semibold rounded hover:bg-red-600 transition-colors"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))}
                </section>

                {/* ── 새 배너 등록 ── */}
                <section className="bg-white rounded-md p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 mb-1">새 배너 등록</h3>
                    <p className="text-xs text-gray-400 mb-4">
                        banner 테이블 · image_url / link_url / sort_order / is_active
                    </p>

                    <div className="grid grid-cols-2 gap-6">

                        {/* 이미지 업로드 */}
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">
                                배너 이미지 <span className="text-red-400">*</span>
                                <span className="text-gray-300 ml-1">image_url</span>
                            </label>
                            <div
                                onDrop={handleImageDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => imageInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-200 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors overflow-hidden"
                                style={{ minHeight: 140 }}
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="미리보기"
                                        className="w-full object-contain max-h-40"
                                    />
                                ) : (
                                    <>
                                        <span className="text-2xl mb-2 text-gray-300">+</span>
                                        <p className="text-sm text-gray-400">클릭하여 이미지 업로드</p>
                                        <p className="text-xs text-gray-300 mt-1">
                                            권장 사이즈 1905 × 600px · JPG, PNG
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
                            {imageFile && (
                                <p className="text-xs text-green-600 mt-1">선택됨: {imageFile.name}</p>
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

                            {/* 등록 버튼 */}
                            <div className="mt-auto">
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || banners.length >= 3}
                                    className="w-full px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-500 active:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {submitting
                                        ? "등록 중..."
                                        : banners.length >= 3
                                        ? "최대 3개 등록됨"
                                        : "배너 등록"}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* ── 삭제 확인 모달 ── */}
            {confirmId && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg px-8 py-6 w-72 text-center">
                        <p className="text-sm text-gray-700 mb-5">이 배너를 삭제하시겠습니까?</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={handleDelete}
                                className="px-5 py-2 bg-red-500 text-white text-sm font-semibold rounded hover:bg-red-600 transition-colors"
                            >
                                삭제
                            </button>
                            <button
                                onClick={() => setConfirmId(null)}
                                className="px-5 py-2 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50 transition-colors"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── 토스트 ── */}
            {toast && (
                <div
                    className={`fixed bottom-8 right-8 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium z-50 transition-all ${
                        toast.type === "error" ? "bg-red-500" : "bg-green-500"
                    }`}
                >
                    {toast.message}
                </div>
            )}
        </AdminLayout>
    )
}
export default AdminBannerPage