// 연락처 포맷 (010-1234-5678)
export const fmtTel = (v) => {
  if (!v) return '-';
  const n = v.replace(/[^0-9]/g, '');
  if (n.length === 11) return `${n.slice(0, 3)}-${n.slice(3, 7)}-${n.slice(7)}`;
  if (n.length === 10) return `${n.slice(0, 3)}-${n.slice(3, 6)}-${n.slice(6)}`;
  return v;
};

// 사업자번호 포맷 (123-45-67890)
export const fmtBizNo = (v) => {
  if (!v) return '-';
  const n = v.replace(/[^0-9]/g, '');
  if (n.length !== 10) return v;
  return `${n.slice(0, 3)}-${n.slice(3, 5)}-${n.slice(5)}`;
};

// 날짜시간 포맷 (2026-04-06 10:30)
export const fmtDateTime = (dt) => {
  if (!dt) return '-';
  return dt.replace('T', ' ').slice(0, 16);
};

// 성별 포맷
export const fmtGender = (gender) => {
  if (gender === 1) return '남성';
  if (gender === 2) return '여성';
  return '미지정';
};

// 연락처 입력 포맷 (자동 하이픈)
export const formatTelInput = (v) => {
  const n = v.replace(/[^0-9]/g, '').slice(0, 11);
  if (n.length <= 3) return n;
  if (n.length <= 7) return `${n.slice(0, 3)}-${n.slice(3)}`;
  return `${n.slice(0, 3)}-${n.slice(3, 7)}-${n.slice(7)}`;
};

// 사업자번호 입력 포맷 (자동 하이픈)
export const formatBizNoInput = (v) => {
  const n = v.replace(/[^0-9]/g, '').slice(0, 10);
  if (n.length <= 3) return n;
  if (n.length <= 5) return `${n.slice(0, 3)}-${n.slice(3)}`;
  return `${n.slice(0, 3)}-${n.slice(3, 5)}-${n.slice(5)}`;
};

// 비밀번호 정규식
export const pwdRegex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*]).{8,20}$/;

// 이메일 정규식
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 비밀번호 에러 메시지
export const PWD_ERROR_MSG =
  '8~20자, 영문과 숫자 또는 특수문자(!@#$%^&*)를 포함해야 합니다.';

// ===== 공통 CSS 클래스 =====

// input 기본
export const INPUT_BASE =
  "w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 transition-all";

// input 에러/정상 상태
export const INPUT_ERR =
  "border-red-300 focus:border-red-300 focus:ring-red-100";
export const INPUT_OK =
  "border-gray-200 focus:border-blue-300 focus:ring-blue-100";

// 검색 input
export const INPUT_SEARCH =
  "w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all bg-white";

// 버튼
export const BTN_PRIMARY =
  "px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors";
export const BTN_SECONDARY =
  "px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors";
export const BTN_DANGER =
  "px-5 py-2.5 text-sm font-semibold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors";

// 삭제/탈퇴 버튼 (활성/비활성)
export const BTN_DELETE_ACTIVE =
  "bg-red-50 text-red-600 border-red-200 hover:bg-red-100";
export const BTN_DELETE_DISABLED =
  "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed";

// 뒤로가기 링크
export const LINK_BACK =
  "text-sm text-gray-400 hover:text-gray-600 transition-colors mb-1 flex items-center gap-1";

// 검색 X 버튼
export const BTN_SEARCH_CLEAR =
  "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm";
