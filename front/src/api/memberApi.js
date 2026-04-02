import axios from "axios";
import axiosInstance from "./axios";

//1. 에러 파싱 헬퍼

export function parseApiError(err) {
const data = err?.response?.data;
if(!data) return {_global: "서버와 통신 중 오류가 발생했습니다."};

//@valid 에러 처리
if(data.errors && Array.isArray(data.errors)){
    return data.errors.reduce( (acc, e) => {
        acc[e.field] = e.defaultMessage;
        return acc;
    },{});
}

// 일반 예외 처리
if( data.message) return {_global: data.message};
return {_global:"알 수 없는 오류가 발생했습니다."}
}


// 2. 이메일 인증관련 api

//인증코드 발송
export const sendEmailCode = (emailOrObject) => {
    const data= typeof emailOrObject === "string"
    ?{email : emailOrObject}
    : emailOrObject
    
   return axiosInstance.post("/member/email/send",data)
}
//인증코드 확인
export const verifyEmailCode = (email,code) =>
    axiosInstance.post("/member/email/verify",{email,code})

// 3. 회원가입 및 로그인 api

//일반 회원가입
export const userSignup = (payload) =>
    axiosInstance.post("/member/signup",payload)

//로그인
export const login = (loginParam) =>
    axiosInstance.post("/member/login",loginParam).then(res => res.data)

//아이디 중복 체크
export const checkLoginId = (loginId) =>
 axiosInstance.get(`/member/check-id?loginId=${loginId}`)

//마이페이지 정보 조회 함수
export const getMemberInfo = () => {
    return axiosInstance.get(`/member/me`)
}

//회원 정보 수정
export const updateMemberInfo = (payload) => {
    return axiosInstance.put(`/member/modify`,payload)
}

//회원 아이디 찾기
export const findMemberId = (data) => {
    return axiosInstance.post(`/member/find-id`,data)
}

//회원 비밀번호 찾기
export const resetPassword = (data) => {
    return axiosInstance.post(`/member/reset-password`,data)
}

//회원 탈퇴
export const withdrawMember = (data) => {
    return axiosInstance.post("/member/withdraw",data)
}