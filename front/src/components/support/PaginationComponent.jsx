import React from 'react';

const PaginationComponent = ({ currentPage, totalItems, itemsPerPage, onPageChange}) => {

  const totalPages = Math.ceil(totalItems/itemsPerPage);
  const pageNumList = Array.from({length:totalPages}, (_, i)=> i+1);

  if(totalItems < 0) return null;

  return (
    <div className="flex justify-center items-center gap-1 mt-12 pb-10">
      {/* 이전 버튼*/}
      <button 
        onClick={() => currentPage > 1 && onPageChange(currentPage -1)}
        className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 text-xs disabled:opacity-30"
      >
        &lt;
      </button>

      {/* 페이지 번호: 백엔드에서 넘겨준 pageNumList를 사용 */}
      {pageNumList.map(num => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`w-8 h-8 flex items-center justify-center text-[13px] border ${
            num === currentPage 
              ? 'bg-[#333] text-white border-[#333] font-bold' 
              : 'text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {num}
        </button>
      ))}

      {/* 다음 버튼 */}
      <button 
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 text-xs disabled:opacity-30"
      >
        &gt;
      </button>
    </div>
  );
};

export default PaginationComponent;