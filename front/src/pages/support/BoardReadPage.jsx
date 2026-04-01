import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BasicLayout from '../../layouts/BasicLayout';
import { getNoticeOne } from '../../api/boardApi'; // 상세 조회 및 삭제 API 가정

const BoardReadPage = () => {
  const { bno } = useParams(); // URL 파라미터에서 게시글 번호 추출
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // DTO 필드명
  useEffect(() => {
    setLoading(true);
    getNoticeOne(bno).then(data => {
      setPost(data);
      setLoading(false);
    }).catch(err => {
      console.error("데이터 로드 실패:", err);
      setLoading(false);
    });
  }, [bno]);

  const moveToList = () => navigate('/board/list');
  const moveToModify = () => navigate(`/board/modify/${bno}`);

  if (loading) return <div className="p-10 text-center text-gray-500">데이터를 불러오는 중입니다...</div>;
  if (!post) return <div className="p-10 text-center text-gray-500">존재하지 않는 게시글입니다.</div>;

  return (
    <BasicLayout>
      <div className="max-w-5xl mx-auto py-12 px-6 bg-white min-h-screen">
        
        {/* 상단 헤더: 제목 및 정보 [cite: 2026-03-30] */}
        <div className="border-b-2 border-gray-800 pb-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[#1D3C28] font-bold text-sm uppercase tracking-wider">Customer Inquiry</span>
            {post.answerContent && !post.isDeleted && (
              <span className="bg-[#1D3C28] text-white text-[10px] px-2 py-0.5 rounded-full">답변완료</span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex justify-between items-center text-gray-400 text-sm font-light">
            <div className="flex gap-4">
              <span>작성자: <span className="text-gray-600 font-medium">{post.writerName}</span></span>
              <span>작성일: <span>{post.createdAt?.split('T')[0]}</span></span>
            </div>
            <div>조회수: {post.viewCount}</div>
          </div>
        </div>

        {/* 본문 내용 */}
        <div className="min-h-[300px] text-gray-700 leading-relaxed text-lg mb-12 whitespace-pre-wrap">
          {post.content}
        </div>

        {/* 관리자 답변 영역 (답변이 있고 삭제되지 않았을 때만 노출) */}
        {post.answerContent && !post.isDeleted ? (
          <div className="bg-[#F9F9FB] rounded-lg p-8 mb-12 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#1D3C28] rounded-full flex items-center justify-center text-white font-bold text-sm">A</div>
              <span className="font-bold text-gray-800">지오리진 몰 관리자 답변</span>
              <span className="text-xs text-gray-400 ml-auto">
                답변일: {post.answeredAt?.split('T')[0]}
              </span>
            </div>
            <div className="text-gray-600 leading-7 pl-11">
              {post.answerContent}
            </div>
          </div>
        ) : post.isDeleted && (
          <div className="bg-gray-50 rounded-lg p-6 mb-12 border border-dashed border-gray-200 text-center text-gray-400 text-sm">
            관리자에 의해 삭제된 답변입니다.
          </div>
        )}

        {/* 하단 버튼 영역 */}
        <div className="flex justify-center gap-3 border-t border-gray-100 pt-10">
          <button 
            onClick={moveToList}
            className="px-8 py-3 border border-gray-200 text-gray-600 rounded-sm hover:bg-gray-50 transition-colors text-sm"
          >
            목록으로
          </button>
          <button 
            onClick={moveToModify}
            className="px-8 py-3 bg-gray-800 text-white rounded-sm hover:bg-gray-700 transition-colors text-sm"
          >
            수정하기
          </button>
        </div>
      </div>
    </BasicLayout>
  );
};

export default BoardReadPage;