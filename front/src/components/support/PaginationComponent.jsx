import React from 'react';

/**
 * 블록 페이지네이션 (10페이지 단위)
 * 예) 총 25페이지, 현재 15페이지
 *   << < 11 12 13 14 [15] 16 17 18 19 20 > >>
 *   - `<<` 첫 페이지로 이동
 *   - `<`  이전 블록 마지막 페이지로 이동
 *   - 숫자 클릭 시 해당 페이지로 이동
 *   - `>`  다음 블록 첫 페이지로 이동
 *   - `>>` 마지막 페이지로 이동
 */
const PaginationComponent = ({ currentPage, totalItems, itemsPerPage, onPageChange, blockSize = 10 }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalItems <= 0) return null;

  // 현재 블록 계산
  const currentBlock = Math.ceil(currentPage / blockSize);
  const blockStart = (currentBlock - 1) * blockSize + 1;
  const blockEnd = Math.min(currentBlock * blockSize, totalPages);

  const pageNumList = Array.from(
    { length: blockEnd - blockStart + 1 },
    (_, i) => blockStart + i
  );

  const hasPrevBlock = blockStart > 1;
  const hasNextBlock = blockEnd < totalPages;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // 스타일
  const btnBase = "w-8 h-8 flex items-center justify-center text-[13px] border transition-colors";
  const btnActive = "bg-[#333] text-white border-[#333] font-bold";
  const btnInactive = "text-gray-500 border-gray-200 hover:bg-gray-50";
  const btnArrow = "w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed";

  const goFirst = () => !isFirstPage && onPageChange(1);
  const goPrevBlock = () => hasPrevBlock && onPageChange(blockStart - 1);
  const goNextBlock = () => hasNextBlock && onPageChange(blockEnd + 1);
  const goLast = () => !isLastPage && onPageChange(totalPages);

  return (
    <div className="flex justify-center items-center gap-1">

      {/* 첫 페이지 이동 */}
      <button
        type="button"
        onClick={goFirst}
        disabled={isFirstPage}
        className={btnArrow}
        aria-label="첫 페이지"
      >
        &laquo;
      </button>

      {/* 이전 블록 */}
      <button
        type="button"
        onClick={goPrevBlock}
        disabled={!hasPrevBlock}
        className={btnArrow}
        aria-label="이전 블록"
      >
        &lsaquo;
      </button>

      {/* 현재 블록의 페이지 번호 */}
      {pageNumList.map(num => (
        <button
          key={num}
          type="button"
          onClick={() => onPageChange(num)}
          className={`${btnBase} ${num === currentPage ? btnActive : btnInactive}`}
          aria-current={num === currentPage ? 'page' : undefined}
        >
          {num}
        </button>
      ))}

      {/* 다음 블록 */}
      <button
        type="button"
        onClick={goNextBlock}
        disabled={!hasNextBlock}
        className={btnArrow}
        aria-label="다음 블록"
      >
        &rsaquo;
      </button>

      {/* 마지막 페이지 이동 */}
      <button
        type="button"
        onClick={goLast}
        disabled={isLastPage}
        className={btnArrow}
        aria-label="마지막 페이지"
      >
        &raquo;
      </button>

    </div>
  );
};

export default PaginationComponent;
