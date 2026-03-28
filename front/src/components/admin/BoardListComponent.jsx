import React, { useState } from 'react';

const BoardListComponent = ({ boardId, onMoveToRead, onMoveToAdd }) => {
  const isNotice = boardId === 1; 
  const [openInquiry, setOpenInquiry] = useState(null);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{isNotice ? '공지사항 관리' : '고객문의 관리'}</h2>
          <p className="text-sm text-gray-500">G-Origin Mall의 게시물을 효율적으로 관리하세요.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700">삭제</button>
          <button onClick={onMoveToAdd} className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800">등록</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-50 border-b text-gray-600 font-semibold">
            <tr>
              <th className="p-4 w-12"><input type="checkbox" /></th>
              <th className="p-4 w-16">No.</th>
              <th className="p-4 text-left">제목</th>
              <th className="p-4 w-32">작성자</th>
              <th className="p-4 w-32">작성일</th>
              <th className="p-4 w-20">조회수</th>
              {!isNotice && <th className="p-4 w-24">관리</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => onMoveToRead(10)}>
              <td className="p-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" /></td>
              <td className="p-4 text-gray-500">10</td>
              <td className="p-4 text-left font-medium text-gray-900">2026년 봄 특산물 행사 안내</td>
              <td className="p-4">admin</td>
              <td className="p-4 text-gray-500">2026-03-01</td>
              <td className="p-4 text-gray-500">324</td>
              {!isNotice && (
                <td className="p-4">
                  <button 
                    className="text-blue-600 border border-blue-600 px-2 py-1 rounded text-xs font-bold"
                    onClick={(e) => { e.stopPropagation(); setOpenInquiry(openInquiry === 10 ? null : 10); }}
                  >
                    답변보기
                  </button>
                </td>
              )}
            </tr>
            {/* 고객문의 답변 영역 (WF 반영) */}
            {!isNotice && openInquiry === 10 && (
              <tr className="bg-gray-50/50">
                <td colSpan="7" className="p-6 text-left border-l-4 border-yellow-400">
                  <div className="mb-2 font-bold text-yellow-700">Q. 문의 내용: 배송은 언제 되나요?</div>
                  <textarea className="w-full p-4 border rounded bg-white outline-none" placeholder="답변을 입력하세요."></textarea>
                  <div className="flex justify-end mt-2">
                    <button className="bg-black text-white px-4 py-1 rounded text-xs font-bold">등록</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BoardListComponent;