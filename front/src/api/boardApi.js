import axios from "axios";

// 1. 서버 기본 주소 
export const API_SERVER_HOST = 'http://localhost:8080';

// 2. 게시판 공통 경로
const host = `${API_SERVER_HOST}/api/board`;

// [공지사항] 목록 조회(페이지네이션 포함)
export const fetchNotice = async (page = 0, size = 10) => {
    const response = await axios.get(`${host}/notice`, { params: { page, size } });
    return response.data;
}

// [공지사항] 상세조회(게시글 읽기)
export const getNoticeOne = async(id) => {
    const response = await axios.get(`${host}/notice/${id}`);
    return response.data
}

// [고객문의] 목록 조회
export const fetchInquiries = async (page = 0, size = 10) => {
    const response = await axios.get(`${host}/inquiry`, { params: { page, size } });
    return response.data;
}

// [고객문의] 문의 등록
export const addInquiry = async (inquiryObj) => {
    const response = await axios.post(`${host}/inquiry`, inquiryObj);
    return response.data;
}