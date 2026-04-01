import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BoardAddComponent from '../../components/admin/BoardAddComponent';
import AdminLayout from '../../layouts/AdminLayout';

const AdminBoardAddPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isInquiry = location.pathname.includes('inquiry');
  const boardId = isInquiry ? 2 : 1;

  const moveToList = () => {
    navigate({ pathname: isInquiry ? '/admin/inquiry' : '/admin/board' });
  };

  return (
    <AdminLayout>
    <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
      <div className="mb-8 text-sm text-gray-400">
        게시판 관리 &gt; {boardId === 1 ? '공지사항' : '고객문의'} &gt; <span className="text-gray-600 font-semibold">신규 등록</span>
      </div>

      {/* 등록 컴포넌트 호출 - 와이어프레임 기능 반영 */}
      <div className="w-full max-w-5xl mx-auto shadow-xl rounded-xl overflow-hidden">
        <BoardAddComponent 
          boardId={boardId} 
          onMoveToList={moveToList} 
        />
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminBoardAddPage;