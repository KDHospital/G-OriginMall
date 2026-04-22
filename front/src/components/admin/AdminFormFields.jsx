import React from 'react';

/**
 * 관리자 폼 공통 UI 컴포넌트 모음.
 * 회원/판매자/관리자 등록·수정 페이지에서 공통으로 사용.
 */

// 라벨 (필수 표시 * 지원)
export const Label = ({ text, required }) => (
  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
    {text}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

// 에러 메시지
export const ErrorMsg = ({ msg }) => {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1.5">{msg}</p>;
};

// 상세 페이지용 필드 (라벨 + 내용)
export const DetailField = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</label>
    {children}
  </div>
);

// 상세 페이지용 텍스트 (값 없으면 '-' 표시)
export const DetailText = ({ value }) => <p className="text-sm text-gray-800">{value || '-'}</p>;

// 폼 필드 래퍼 (라벨 + children, 선택적 col-span-2, 필수 여부)
export const Field = ({ label, children, span2, required }) => (
  <div className={span2 ? 'col-span-2' : ''}>
    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);
