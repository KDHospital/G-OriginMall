import React, { useState } from 'react';
import { addInquiry } from '../../api/boardApi';

const BoardAddComponent = ({ boardId, onMoveToList }) => {
  const [post, setPost] = useState({
    title: '',
    content: '',
    boardId: boardId,
    isPublic: true
  });
  const [fetching, setFetching] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'isPublic') {
      setPost({ ...post, isPublic: value === 'true' });
    } else {
      setPost({ ...post, [name]: value });
    }
  };

  const handleClickAdd = async () => {
    if (!post.title.trim()) return alert("제목을 입력해주세요.");
    if (!post.content.trim()) return alert("내용을 입력해주세요.");

    setFetching(true);
    try {
      await addInquiry({
        title: post.title.trim(),
        content: post.content.trim(),
        boardId: post.boardId,
        isPublic: post.isPublic
      });
      alert("성공적으로 등록되었습니다.");
      onMoveToList();
    } catch (error) {
      console.error("등록 실패:", error);
      alert("등록 중 오류가 발생했습니다.");
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-end">
        <div>
          <button onClick={onMoveToList} className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-1 flex items-center gap-1">
            <span>←</span> 목록으로
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{boardId === 1 ? '공지사항' : '고객문의'} 등록</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={onMoveToList} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">취소</button>
          <button onClick={handleClickAdd} disabled={fetching} className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">
            {fetching ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      {/* 폼 카드 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* 제목 + 공개여부 */}
        <div className="px-6 py-5 border-b border-gray-100">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">제목</label>
          <div className="flex gap-3 items-center">
            <select
              name="isPublic"
              value={String(post.isPublic)}
              onChange={handleChange}
              className="shrink-0 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="true">공개</option>
              <option value="false">비공개</option>
            </select>
            <input
              name="title"
              value={post.title}
              onChange={handleChange}
              type="text"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg outline-none text-gray-800 placeholder-gray-300 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="제목을 입력하세요"
            />
          </div>
        </div>

        {/* 본문 */}
        <div className="px-6 py-5">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">내용</label>
          <textarea
            name="content"
            value={post.content}
            onChange={handleChange}
            className="w-full min-h-[400px] px-4 py-4 border border-gray-200 rounded-lg outline-none text-sm text-gray-700 leading-relaxed placeholder-gray-300 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all resize-y"
            placeholder="내용을 상세히 입력해 주세요"
          />
        </div>
      </div>
    </div>
  );
};

export default BoardAddComponent;
