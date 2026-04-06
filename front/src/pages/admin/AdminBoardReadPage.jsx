import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BoardReadComponent from '../../components/admin/BoardReadComponent';
import AdminLayout from '../../layouts/AdminLayout';

const AdminBoardReadPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isInquiry = location.pathname.includes('inquiry');

  const moveToList = () => navigate(isInquiry ? '/admin/inquiry' : '/admin/board');
  const moveToModify = (id) => navigate(isInquiry ? `/admin/inquiry/modify/${id}` : `/admin/board/modify/${id}`);

  return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="mb-4 text-sm text-gray-400">게시판 관리 &gt; {isInquiry ? '고객문의' : '공지사항'} &gt; <span className="text-gray-600 font-semibold">{isInquiry ? '고객문의' : '공지사항'} 상세</span></div>
        <BoardReadComponent postId={postId} onMoveToList={moveToList} onMoveToModify={moveToModify} />
      </div>
    </AdminLayout>
  );
};

export default AdminBoardReadPage;
