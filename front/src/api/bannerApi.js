import axiosInstance from "./axios";
//배너 목록 조회

const BASE = "/admin/banners"

//웹- 배너 목록 조회하여 배너 리스트 가져오기
export const getActiveBanners = () => {
    return axiosInstance.get('/banners')
}
//어드민- 배너 목록 전체 조회
export const getBannerList = () => {
    return axiosInstance.get(`${BASE}`)
}
//어드민- 배너 단건 조회 (수정 페이지 진입 시 사용)
export const getBanner = (bannerId) => {
    return axiosInstance.get(`${BASE}/${bannerId}`)
}
//어드민- 배너 등록 (multipart/form-data)
export const createBanner = (formData) => {
    return axiosInstance.post(BASE,formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}
//어드민- 배너 수정 (multipart/form-data)
export const updateBanner = (bannerId, formData) => {
    return axiosInstance.put(`${BASE}/${bannerId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}

//어드민- 배너 삭제
export const deleteBanner = (bannerId) => {
    return axiosInstance.delete(`${BASE}/${bannerId}`)
}

// 어드민 - 노출 여부 토글
export const toggleActive = (bannerId) => {
    return axiosInstance.patch(`${BASE}/${bannerId}/toggle`)
}

// 어드민 - 드래그 앤 드롭 순서 일괄 변경
export const updateBannerOrder = (ids) => {
    return axiosInstance.patch(`${BASE}/sort-order`, {
        bannerIds: ids
    })
}