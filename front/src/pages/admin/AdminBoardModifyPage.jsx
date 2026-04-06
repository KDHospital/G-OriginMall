import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BoardModifyComponent from '../../components/admin/BoardModifyComponent';
import AdminLayout from '../../layouts/AdminLayout';

const AdminBoardModifyPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isInquiry = location.pathname.includes('inquiry');

  const moveToRead = (id) => navigate(isInquiry ? `/admin/inquiry/read/${id}` : `/admin/board/read/${id}`);

  return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="mb-4 text-sm text-gray-400">게시판 관리 &gt; {isInquiry ? '고객문의' : '공지사항'} &gt; <span className="text-gray-600 font-semibold">{isInquiry ? '고객문의' : '공지사항'} 수정</span></div>
        <BoardModifyComponent bno={postId} onMoveToRead={moveToRead} />
      </div>
    </AdminLayout>
  );
};

export default AdminBoardModifyPage;
