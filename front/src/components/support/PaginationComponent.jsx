import React from 'react';

const PaginationComponent = ({ serverData, movePage }) => {
  // 현재 페이지와 전체 페이지 목록 생성 (더미 데이터용 임시 로직)
  const pageNumList = [1, 2, 3]; 

  return (
    <div className="flex justify-center items-center gap-1 mt-12 pb-10">
      {/* 이전 버튼 */}
      <button className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 text-xs">
        &lt;
      </button>

      {/* 페이지 번호 */}
      {pageNumList.map(num => (
        <button
          key={num}
          onClick={() => movePage && movePage({ page: num })}
          className={`w-8 h-8 flex items-center justify-center text-[13px] border ${
            num === 1 
              ? 'bg-[#333] text-white border-[#333] font-bold' 
              : 'text-gray-500 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {num}
        </button>
      ))}

      {/* 다음 버튼 */}
      <button className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 text-xs">
        &gt;
      </button>
    </div>
  );
};

export default PaginationComponent;