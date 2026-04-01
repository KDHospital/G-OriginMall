import React, { useState, useEffect } from 'react';

// 초기 상태 (백엔드 DTO 구조와 매칭)
const initState = {
  bno: 0,
  title: '',
  content: '',
  writer: 'admin',
  isPublic: 'V', // V: 공개, X: 비공개
  startDate: '2026-03-01',
  endDate: '2026-03-31',
  boardId: 0
};

const BoardModifyComponent = ({ bno, onMoveToRead }) => {
  const [post, setPost] = useState(initState);
  const [fetching, setFetching] = useState(false);

  // 1. [로직] 화면 로딩 시 bno를 사용하여 기존 데이터를 불러와 폼에 채움
  useEffect(() => {
    setFetching(true);
    console.log(`게시글 ${bno}번 데이터를 불러오는 중... (API 호출 Mockup)`);
    
    // API 연동 예시: 
    // boardApi.getOne(bno).then(data => {
    //   setPost(data);
    //   setFetching(false);
    // });
    
    // [Mockup Data] 테스트를 위해 1초 후 가짜 데이터를 채웁니다.
    setTimeout(() => {
      setPost({
        bno: bno,
        title: '2026년형 프리미엄 강화고구마 출시 안내 (수정 중)',
        content: '기존 공지 내용을 수정합니다. 내용을 입력하세요.',
        writer: 'admin',
        isPublic: 'V',
        startDate: '2026-03-01',
        endDate: '2026-03-31',
        boardId: 1 // 공지사항
      });
      setFetching(false);
    }, 1000);

  }, [bno]);

  // 2. [로직] 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  // 3. [로직] 수정 완료 버튼 클릭 (API 전송)
  const handleClickModify = () => {
    setFetching(true);
    console.log("수정된 데이터 전송 (API 호출 Mockup):", post);
    
    // API 연동 예시:
    // boardApi.putOne(post).then(res => {
    //   setFetching(false);
    //   alert("게시글이 수정되었습니다.");
    //   onMoveToRead(bno); // 수정 후 상세 보기로 이동
    // });
    
    alert("게시글이 수정되었습니다. (Mockup)");
    setFetching(false);
    onMoveToRead(bno); // 상세 보기로 이동
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* 상단 헤더 영역 - G-Origin 스타일 가이드 반영 */}
      <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <button onClick={() => onMoveToRead(bno)} className="mr-3 p-1 hover:bg-gray-200 rounded transition-colors">&lt; 목록</button>
          {post.boardId === 1 ? '공지사항' : '고객문의'} 수정 (No. {bno})
        </h2>
        <div className="flex gap-2 relative z-10"> {/* z-index 추가 */}
          <button 
            type="button" 
            onClick={() => onMoveToRead(bno)} 
            className="bg-gray-500 text-white px-6 py-2 rounded font-bold hover:bg-gray-600 shadow-sm"
          >
            취소
          </button>
          <button 
            type="button" 
            onClick={handleClickModify} 
            disabled={fetching}
            className="bg-black text-white px-6 py-2 rounded font-bold hover:bg-gray-800 shadow-sm disabled:opacity-50"
          >
            {fetching ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      {/* 로딩 표시 (데이터 불러오는 중) */}
      {fetching && <div className="p-10 text-center text-gray-500">데이터를 불러오는 중입니다...</div>}

      {/* 입력 폼 영역 (WF 스타일 반영) */}
      {!fetching && (
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-[120px_1fr] border rounded-lg overflow-hidden relative"> {/* z-index 영향 방지 */}
            {/* 제목 및 공개여부 */}
            <div className="bg-gray-50 p-4 font-bold border-b flex items-center justify-center">제목</div>
            <div className="p-4 border-b flex gap-4 bg-white items-center">
              <div className="flex items-center gap-2 border rounded px-3 py-1.5 text-sm bg-gray-50">
                <span className="text-gray-600 font-bold">공개</span>
                <select 
                  name="isPublic" 
                  value={post.isPublic} 
                  onChange={handleChange} 
                  className="bg-transparent outline-none font-bold text-blue-600"
                >
                  <option value="V">V</option>
                  <option value="X">X</option>
                </select>
              </div>
              <input 
                name="title" 
                value={post.title} 
                onChange={handleChange} 
                type="text" 
                className="flex-1 border rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none" 
                placeholder="제목을 입력하세요." 
              />
            </div>

            {/* 노출 기간 설정 */}
            <div className="bg-gray-50 p-4 font-bold flex items-center justify-center">노출 기간</div>
            <div className="p-4 flex items-center gap-6 bg-white">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-500">시작일</span>
                <input name="startDate" value={post.startDate} onChange={handleChange} type="date" className="border rounded px-3 py-2 text-sm outline-none" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-500">종료일</span>
                <input name="endDate" value={post.endDate} onChange={handleChange} type="date" className="border rounded px-3 py-2 text-sm outline-none" />
              </div>
            </div>
          </div>

          {/* 에디터 목업 영역 (resize-y 추가) */}
          <div className="border rounded-lg overflow-hidden shadow-inner">
            <div className="bg-gray-100 p-2 border-b flex gap-4 text-xs font-bold text-gray-500">
               <span>파일</span><span>편집</span><span>보기</span><span>삽입</span><span>서식</span><span>표</span><span>도움말</span>
            </div>
            <textarea 
              name="content" 
              value={post.content} 
              onChange={handleChange} 
              className="w-full h-96 p-6 outline-none resize-y leading-relaxed" 
              placeholder="내용을 상세히 작성해 주세요."
            ></textarea>
            <div className="bg-gray-50 p-2 border-t flex gap-4 text-xs font-semibold text-gray-600">
               <span className="bg-white px-2 py-1 rounded border shadow-sm cursor-pointer">편집보기</span>
               <span className="px-2 py-1 cursor-pointer">HTML보기</span>
               <span className="px-2 py-1 cursor-pointer">미리보기</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardModifyComponent;