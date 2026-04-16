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

// ===== 어드민 전용 =====

// [어드민] 일반회원 목록 조회
export const adminGetMembers = async (page = 0, size = 10, keyword = '', status = '') => {
    const params = { page, size };
    if (keyword) params.keyword = keyword;
    if (status) params.status = status;
    const response = await axiosInstance.get('/admin/members', { params });
    return response.data;
};

// [어드민] 회원 상세 조회
export const adminGetMember = async (memberId) => {
    const response = await axiosInstance.get(`/admin/members/${memberId}`);
    return response.data;
};

// [어드민] 회원 등록
export const adminCreateMember = async (data) => {
    const response = await axiosInstance.post('/admin/members', data);
    return response.data;
};

// [어드민] 회원 주문 목록 조회
export const adminGetMemberOrders = async (memberId, page = 0, size = 5) => {
    const response = await axiosInstance.get(`/admin/members/${memberId}/orders`, { params: { page, size } });
    return response.data;
};

// [어드민] 회원 수정
export const adminUpdateMember = async (memberId, data) => {
    const response = await axiosInstance.put(`/admin/members/${memberId}`, data);
    return response.data;
};

// [어드민] 회원 삭제 (비활성화)
export const adminDeleteMember = async (memberId) => {
    const response = await axiosInstance.post(`/admin/members/${memberId}/delete`);
    return response.data;
};

// ===== [어드민] 판매회원 관리 =====
export const adminGetSellers = async (page = 0, size = 10, keyword = '', verified = null, status = '') => {
    const params = { page, size };
    if (keyword) params.keyword = keyword;
    if (verified !== null) params.verified = verified;
    if (status) params.status = status;
    const response = await axiosInstance.get('/admin/sellers', { params });
    return response.data;
};

export const adminGetSellerDetail = async (memberId) => {
    const response = await axiosInstance.get(`/admin/sellers/${memberId}`);
    return response.data;
};

export const adminCreateSeller = async (data) => {
    const response = await axiosInstance.post('/admin/sellers', data);
    return response.data;
};

export const adminUpdateSeller = async (memberId, data) => {
    const response = await axiosInstance.put(`/admin/sellers/${memberId}`, data);
    return response.data;
};

export const adminApproveSeller = async (memberId) => {
    const response = await axiosInstance.post(`/admin/approve-seller/${memberId}`);
    return response.data;
};

export const adminRejectSeller = async (memberId) => {
    const response = await axiosInstance.post(`/admin/reject-seller/${memberId}`);
    return response.data;
};

// ===== [어드민] 관리자 =====
export const adminGetAdmins = async (page = 0, size = 10, keyword = '', status = '') => {
    const params = { page, size };
    if (keyword) params.keyword = keyword;
    if (status) params.status = status;
    const response = await axiosInstance.get('/admin/admins', { params });
    return response.data;
};

export const adminGetAdminDetail = async (memberId) => {
    const response = await axiosInstance.get(`/admin/admins/${memberId}`);
    return response.data;
};

export const adminCreateAdmin = async (data) => {
    const response = await axiosInstance.post('/admin/admins', data);
    return response.data;
};

export const adminUpdateAdmin = async (memberId, data) => {
    const response = await axiosInstance.put(`/admin/admins/${memberId}`, data);
    return response.data;
};

export const adminDeleteAdmin = async (memberId) => {
    const response = await axiosInstance.post(`/admin/admins/${memberId}/delete`);
    return response.data;
};