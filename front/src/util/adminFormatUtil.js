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
export const PWD_ERROR_MSG = '8~20자, 영문과 숫자 또는 특수문자(!@#$%^&*)를 포함해야 합니다.';
