import axiosInstance from "./axios";
//배너 목록 조회

//웹- 배너 목록 조회하여 배너 리스트 가져오기
export const getActiveBanners = () => {
    return axiosInstance.get('/banners')
}