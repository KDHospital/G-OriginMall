import axiosInstance from "./axios";

// [공지사항] 목록 조회
export const fetchBoard = async (page = 0, size = 10, keyword = '') => {
    const params = { page, size };
    if (keyword) params.keyword = keyword;
    const response = await axiosInstance.get('/board', { params });
    return response.data;
};

// [고객문의] 목록 조회
export const fetchInquiries = async (page = 0, size = 10, keyword = '', hasAnswer = null, isPublic = null) => {
    const params = { page, size };
    if (keyword) params.keyword = keyword;
    if (hasAnswer !== null) params.hasAnswer = hasAnswer;
    if (isPublic !== null) params.isPublic = isPublic;
    const response = await axiosInstance.get('/board/inquiry', { params });
    return response.data;
};

// [고객문의] 신규 등록
export const addInquiry = async (data) => {
    const response = await axiosInstance.post('/board/inquiry', data);
    return response.data;
};

// [공지사항/고객문의] 상세조회
export const getBoardOne = async (id) => {
    const response = await axiosInstance.get(`/board/${id}`);
    return response.data;
};

// [게시글] 수정
export const updatePost = async (id, data) => {
    const response = await axiosInstance.put(`/board/inquiry/${id}`, data);
    return response.data;
};

// [게시글] 삭제 (소프트 삭제)
export const removePost = async (id) => {
    const response = await axiosInstance.delete(`/board/${id}`);
    return response.data;
};

// [어드민] 게시글 수정
export const adminUpdatePost = async (id, data) => {
    const response = await axiosInstance.put(`/admin/board/post/${id}`, data);
    return response.data;
};

// [어드민] 답변 등록/수정
export const addAnswer = async (postId, answerContent) => {
    const response = await axiosInstance.put(`/admin/board/inquiry/${postId}/answer`, { answerContent });
    return response.data;
};

// [어드민] 게시글 삭제
export const adminRemovePost = async (id) => {
    const response = await axiosInstance.delete(`/admin/board/${id}`);
    return response.data;
};

// [어드민] 공지사항 목록 조회 (비공개 포함)
export const fetchAdminBoard = async (page = 0, size = 10, keyword = '') => {
    const params = { page, size };
    if (keyword) params.keyword = keyword;
    const response = await axiosInstance.get('/admin/board', { params });
    return response.data;
};

// [어드민] 고객문의 목록 조회 (비공개 포함)
export const fetchAdminInquiries = async (page = 0, size = 10, keyword = '', hasAnswer = null, isPublic = null) => {
    const params = { page, size };
    if (keyword) params.keyword = keyword;
    if (hasAnswer !== null) params.hasAnswer = hasAnswer;
    if (isPublic !== null) params.isPublic = isPublic;
    const response = await axiosInstance.get('/admin/board/inquiry', { params });
    return response.data;
};

// [어드민] 게시글 상세 조회 (비공개 포함)
export const getAdminBoardOne = async (id) => {
    const response = await axiosInstance.get(`/admin/board/post/${id}`);
    return response.data;
};
