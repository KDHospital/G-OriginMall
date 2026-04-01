import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BoardReadComponent from '../../components/admin/BoardReadComponent';
import AdminLayout from '../../layouts/AdminLayout';

const AdminBoardReadPage = () => {
  const { pno } = useParams();
  const navigate = useNavigate();

  const moveToList = () => {
    navigate({ pathname: '/admin/board' });
  };

  const moveToModify = (pno) => {
    navigate({ pathname: `/admin/board/modify/${pno}` });
  };

  return (
    <AdminLayout>
    <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
      <div className="mb-8 text-sm text-gray-400">
        게시판 관리 &gt; 공지사항 &gt; <span className="text-gray-600 font-semibold">게시글 상세</span>
      </div>

      <div className="w-full max-w-5xl mx-auto shadow-xl rounded-xl overflow-hidden bg-white">
        <BoardReadComponent 
          pno={pno} 
          onMoveToList={moveToList} 
          onMoveToModify={moveToModify} 
        />
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminBoardReadPage;