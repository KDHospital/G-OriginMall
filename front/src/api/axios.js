import axios from "axios"

// 서버주소만 관리하는 api
export const API_SERVER_HOST = 'http://localhost:8080/api';

const axiosInstance = axios.create({
    baseURL: API_SERVER_HOST,           // Spring Boot 서버
    timeout: 20000,                     // 20초 타임아웃
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,              // 쿠키/세션 포함 (로그인 연동 시 필요)
});
 
// 요청 인터셉터 - 추후 토큰 등 공통 헤더 추가 시 여기에 작성
axiosInstance.interceptors.request.use(
    (config) => {
        const member = JSON.parse(localStorage.getItem("member"));
        const token = member?.data?.accessToken;    // response.data.accessToken
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            
        }
        return config;
    },
    (error) => Promise.reject(error)
);
 
// 응답 인터셉터 - 공통 에러 처리
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;
            if (status === 401) {
                // 비로그인 접근 시 처리 
                console.warn('로그인이 필요합니다.');
                // 토큰 만료 시 localStorage 정리 후 로그인 페이지로 이동
                localStorage.removeItem("member");
                window.location.href = "/login";
            } else if (status === 403) {
                // member.role 에 의한 접근 요청이 맞지 않는 경우 처리(추후 역할에 따른 페이지 접근 제한)
                console.warn('접근 권한이 없습니다.');
            } else if (status === 500) {
                // 서버와의 변수(res, req, data 등)가 맞지 않는 경우(우리는 대부분 이쪽 케이스), 데이터 누락일 경우 처리
                console.error('서버 오류가 발생했습니다.');
            }
        }
        return Promise.reject(error);
    }
);
 
export default axiosInstance;