import axios from "axios";

// 1. 서버 기본 주소 
export const API_SERVER_HOST = 'http://localhost:8080';

// 2. 고객센터 공통 경로
const host = `${API_SERVER_HOST}/api/board`;


// [공지사항] 목록 조회
export const fetchBoard = async (page = 0, size = 10) => {
    const response = await axios.get(`${host}`, { params: { page, size } });
    return response.data;
}

// [고객문의] 목록 조회
export const fetchInquiries = async (page = 0, size = 10) => {
    const response = await axios.get(`${host}/inquiry`, { 
        params: { page, size },
        withCredentials: true 
    });
    return response.data;
};

// [고객문의] 신규 등록
export const addInquiry = async (data) => {
    const response = await axios.post(`${host}/inquiry`, data, {
        withCredentials: true 
    });
    return response.data;
};

//[공지사항/고객문의] 상세조회
export const getBoardOne = async(id) => {
    const response = await axios.get(`${host}/${id}`);
    return response.data;
}


// 게시글 삭제 (소프트 삭제)
export const removePost = async (id) => {
    const response = await axios.post(`${host}/${id}/remove`, {}, {
        withCredentials: true
    });
    return response.data;
};


