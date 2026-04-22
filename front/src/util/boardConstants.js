/**
 * 게시판(board) 관련 상수.
 * 백엔드 PostServiceImpl의 BOARD_NOTICE / BOARD_QNA와 일치해야 함.
 */

// 게시판 ID
export const BOARD_NOTICE = 1;  // 공지사항
export const BOARD_QNA = 2;     // 고객문의

// 게시판 ID → 라벨
export const BOARD_LABEL = {
  [BOARD_NOTICE]: '공지사항',
  [BOARD_QNA]: '고객문의',
};

// 게시판 판별 헬퍼
export const isNoticeBoard = (boardId) => Number(boardId) === BOARD_NOTICE;
export const isInquiryBoard = (boardId) => Number(boardId) === BOARD_QNA;

// 목록 페이지 공통 설정
export const DEFAULT_ITEMS_PER_PAGE = 10;
