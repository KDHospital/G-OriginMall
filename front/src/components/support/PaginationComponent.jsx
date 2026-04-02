import React from 'react';

const PaginationComponent = ({ serverData, movePage }) => {

  const { pageNumList = [], current = 1, prev = false, next = false, prevPage = 0, nextPage = 0 } = serverData || {};

  return (
    <div className="flex justify-center items-center gap-1 mt-12 pb-10">
      {/* 이전 버튼: prev가 true일 때만 작동하도록 설정 가능 */}
      <button 
        onClick={() => prev && movePage({ page: prevPage })}
        disabled={!prev}
        className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 text-xs disabled:opacity-30"
      >
        &lt;
      </button>

      {/* 페이지 번호: 백엔드에서 넘겨준 pageNumList를 사용 */}
      {pageNumList.map(num => (
        <button
          key={num}
          onClick={() => movePage && movePage({ page: num })}
          className={`w-8 h-8 flex items-center justify-center text-[13px] border ${
            num === current 
              ? 'bg-[#333] text-white border-[#333] font-bold' 
              : 'text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {num}
        </button>
      ))}

      {/* 다음 버튼 */}
      <button 
        onClick={() => next && movePage({ page: nextPage })}
        disabled={!next}
        className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 text-xs disabled:opacity-30"
      >
        &gt;
      </button>
    </div>
  );
};

export default PaginationComponent;