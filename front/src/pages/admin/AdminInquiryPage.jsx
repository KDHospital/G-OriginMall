import React from 'react';
import { useNavigate } from 'react-router-dom';
import BoardListComponent from '../../components/admin/BoardListComponent';
import AdminLayout from '../../layouts/AdminLayout';

const AdminInquiryPage = () => {
  const navigate = useNavigate();

  const moveToAdd = () => navigate('/admin/board/add'); 
  const moveToRead = (bno) => navigate(`/admin/board/read/${bno}`);

  return (
    <AdminLayout>
    <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen font-sans">
      <div className="mb-4 text-sm text-gray-400">게시판 관리 &gt; <span className="text-gray-600 font-semibold">고객문의</span></div>
      <BoardListComponent boardId={2} onMoveToRead={moveToRead} onMoveToAdd={moveToAdd} />
    </div>
    </AdminLayout>
  );
};

export default AdminInquiryPage;