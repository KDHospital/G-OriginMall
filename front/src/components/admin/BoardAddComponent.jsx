import React, { useState } from 'react';

const initState = {
  title: '',
  content: '',
  writer: 'admin',
  boardId: 0,
  isPublic: 'V',
  startDate: '2026-03-01',
  endDate: '2026-03-31'
};

const BoardAddComponent = ({ boardId, onMoveToList }) => {
  const [post, setPost] = useState({ ...initState, boardId: boardId });
  const [fetching, setFetching] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleClickAdd = () => {
    setFetching(true);
    console.log("서버 전송 데이터:", post);
    alert("성공적으로 등록되었습니다.");
    setFetching(false);
    onMoveToList();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-800">
          <button onClick={onMoveToList} className="mr-3 text-gray-400 hover:text-black">{'<'}</button>
          {boardId === 1 ? '공지사항' : '고객문의'} 등록
        </h2>
        <div className="flex gap-2">
          <button onClick={onMoveToList} className="bg-gray-500 text-white px-6 py-2 rounded font-bold">취소</button>
          <button onClick={handleClickAdd} className="bg-black text-white px-6 py-2 rounded font-bold">저장</button>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-[120px_1fr] border rounded overflow-hidden">
          <div className="bg-gray-100 p-4 font-bold text-center border-b border-r">제목</div>
          <div className="p-3 border-b flex gap-3">
            <select name="isPublic" value={post.isPublic} onChange={handleChange} className="border p-2 rounded font-bold text-blue-600">
              <option value="V">공개 V</option>
              <option value="X">비공개 X</option>
            </select>
            <input name="title" value={post.title} onChange={handleChange} className="flex-1 border p-2 rounded outline-none" placeholder="제목을 입력하세요." />
          </div>

          <div className="bg-gray-100 p-4 font-bold text-center border-r">노출 기간</div>
          <div className="p-3 flex items-center gap-4">
            <input name="startDate" type="date" value={post.startDate} onChange={handleChange} className="border p-2 rounded text-sm" />
            <span className="text-gray-400">~</span>
            <input name="endDate" type="date" value={post.endDate} onChange={handleChange} className="border p-2 rounded text-sm" />
          </div>
        </div>

        <div className="border rounded overflow-hidden shadow-inner">
          <div className="bg-gray-50 p-2 text-xs text-gray-400 border-b flex gap-4 font-mono">
            <span>File</span><span>Edit</span><span>View</span><span>Insert</span><span>Format</span>
          </div>
          <textarea 
            name="content" 
            value={post.content} 
            onChange={handleChange} 
            className="w-full h-80 p-6 outline-none resize-none leading-relaxed" 
            placeholder="내용을 상세히 입력해 주세요."
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default BoardAddComponent;