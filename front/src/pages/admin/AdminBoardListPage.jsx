import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BoardListComponent from '../../components/admin/BoardListComponent';
import AdminLayout from '../../layouts/AdminLayout';

const AdminBoardListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isInquiry = location.pathname.includes('inquiry');
  const boardId = isInquiry ? 2 : 1;

  const moveToAdd = () => navigate({ pathname: isInquiry ? '/admin/inquiry/new' : '/admin/board/new' });
  const moveToRead = (bno) => navigate({ pathname: isInquiry ? `/admin/inquiry/read/${bno}` : `/admin/board/read/${bno}` });

  return (
    <AdminLayout>
    <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
       <div className="mb-4 text-sm text-gray-400">게시판 관리 &gt; <span className="text-gray-600 font-semibold">{isInquiry ? '고객문의' : '공지사항'}</span></div>
       <BoardListComponent boardId={boardId} onMoveToRead={moveToRead} onMoveToAdd={moveToAdd} />
    </div>
    </AdminLayout>
  );
};

export default AdminBoardListPage;