import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BoardModifyComponent from '../../components/admin/BoardModifyComponent';
import AdminLayout from '../../layouts/AdminLayout';

const AdminBoardModifyPage = () => {
  // 1. URL 파라미터에서 bno 추출
  const { bno } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 2. 현재 경로를 확인하여 공지사항인지 고객문의인지 구분
  const isInquiry = location.pathname.includes('inquiry');

  // 3. 수정 취소 또는 완료 시 이동할 함수 (상세 보기로 이동)
  const moveToRead = (currentBno) => {
    const path = isInquiry 
      ? `/admin/inquiry/read/${currentBno}` 
      : `/admin/board/read/${currentBno}`;
    navigate({ pathname: path });
  };

  return (
    <AdminLayout>
    <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          게시판 관리 &gt; {isInquiry ? '고객문의' : '공지사항'} &gt; 
          <span className="text-gray-600 font-semibold ml-1">게시글 수정</span>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          DOC_ID: G-ORIGIN-BOARD-MOD-{bno}
        </div>
      </div>

      {/* 수정 컴포넌트 호출 */}
      <div className="w-full max-w-5xl mx-auto">
        <BoardModifyComponent 
          bno={bno} 
          onMoveToRead={moveToRead} 
        />
      </div>

      {/* 하단 여백 및 정보 */}
      <div className="mt-12 text-center text-xs text-gray-300">
        최종 수정 시각: 2026-03-28 | 관리자 세션 유지 중
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminBoardModifyPage;