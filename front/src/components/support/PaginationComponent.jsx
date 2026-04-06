import React from 'react';

const PaginationComponent = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalItems <= 0) return null;

  // 현재 페이지 기준 앞뒤 2페이지만 표시 (최대 5개)
  const getPageNumbers = () => {
    const delta = 2;
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumList = getPageNumbers();
  const showLeftEllipsis = pageNumList[0] > 1;
  const showRightEllipsis = pageNumList[pageNumList.length - 1] < totalPages;

  const btnBase = "w-8 h-8 flex items-center justify-center text-[13px] border";
  const btnActive = "bg-[#333] text-white border-[#333] font-bold";
  const btnInactive = "text-gray-500 border-gray-200 hover:bg-gray-50";
  const btnArrow = "w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30";

  return (
    <div className="flex justify-center items-center gap-1">

      {/* 이전 버튼 */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={btnArrow}
      >
        &lt;
      </button>

      {/* 첫 페이지 + 왼쪽 말줄임 */}
      {showLeftEllipsis && (
        <>
          <button onClick={() => onPageChange(1)} className={`${btnBase} ${btnInactive}`}>
            1
          </button>
          <span className="w-8 h-8 flex items-center justify-center text-gray-400">
            ...
          </span>
        </>
      )}

      {/* 페이지 번호 목록 */}
      {pageNumList.map(num => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`${btnBase} ${num === currentPage ? btnActive : btnInactive}`}
        >
          {num}
        </button>
      ))}

      {/* 오른쪽 말줄임 + 마지막 페이지 */}
      {showRightEllipsis && (
        <>
          <span className="w-8 h-8 flex items-center justify-center text-gray-400">
            ...
          </span>
          <button onClick={() => onPageChange(totalPages)} className={`${btnBase} ${btnInactive}`}>
            {totalPages}
          </button>
        </>
      )}

      {/* 다음 버튼 */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={btnArrow}
      >
        &gt;
      </button>

    </div>
  );
};

export default PaginationComponent;