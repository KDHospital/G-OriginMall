import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BoardAddComponent from '../../components/admin/BoardAddComponent';
import AdminLayout from '../../layouts/AdminLayout';

const AdminBoardAddPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isInquiry = location.pathname.includes('inquiry');
  const boardId = isInquiry ? 2 : 1;

  const moveToList = () => navigate(isInquiry ? '/admin/inquiry' : '/admin/board');

  return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="mb-4 text-sm text-gray-400">게시판 관리 &gt; {isInquiry ? '고객문의' : '공지사항'} &gt; <span className="text-gray-600 font-semibold">신규 등록</span></div>
        <BoardAddComponent boardId={boardId} onMoveToList={moveToList} />
      </div>
    </AdminLayout>
  );
};

export default AdminBoardAddPage;
