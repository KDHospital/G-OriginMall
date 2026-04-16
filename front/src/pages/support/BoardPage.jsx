import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BasicLayout from '../../layouts/BasicLayout';
import UserSupportComponent from '../../components/support/UserSupportComponent';
import PaginationComponent from '../../components/support/PaginationComponent';
import { fetchBoard } from '../../api/boardApi';

const BoardListPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const itemsPerPage = 10;
  const [totalItems, setTotalItems] = useState(0);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchBoard(currentPage - 1, itemsPerPage)
      .then(data => {
        setInquiries(data.dtoList || []);
        setTotalItems(data.totalCount || 0);
      })
      .catch(err => console.error("로드 실패:", err))
      .finally(() => setLoading(false));
  }, [currentPage]);

  const handlePageChange = (page) => {
    navigate(`/board?page=${page}&size=${itemsPerPage}`);
  };

  return (
    <BasicLayout>
      <UserSupportComponent
        title="공지사항"
        description="지오리진 몰의 새로운 소식을 전해드립니다."
      >
        <div className="w-full">

          {/* 로딩 상태 표시 추가 */}
          {loading ? (
            <div className="text-center py-20 text-gray-400">불러오는 중...</div>
          ) : (
            <table className="w-full text-[13px] border-t-2 border-gray-800">
              <thead>
                <tr className="bg-[#F9F9FB] border-b border-gray-100 text-gray-600">
                  <th className="py-4 w-16 font-normal">번호</th>
                  <th className="py-4 text-left px-6 font-normal">제목</th>
                  <th className="py-4 w-28 font-normal">작성자</th>
                  <th className="py-4 w-32 font-normal">작성일</th>
                  <th className="py-4 w-20 font-normal">조회수</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-gray-400">
                      등록된 공지사항이 없습니다.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((post, index) => (
                    <tr
                      key={post.postId}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/board/read/${post.postId}`)}
                    >
                      <td className="py-4 text-center text-gray-300">
                        {totalItems - (currentPage - 1) * itemsPerPage - index}
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-700">
                        {post.title}
                      </td>
                      <td className="py-4 text-center text-gray-500">
                        {post.mName || '관리자'} 
                      </td>
                      <td className="py-4 text-center text-gray-400">
                        {post.createdAt?.split('T')[0]}
                      </td>
                      <td className="py-4 text-center text-gray-400">
                        {post.viewCount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          <div className="mt-10 mb-20">
            <PaginationComponent
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </UserSupportComponent>
    </BasicLayout>
  );
};

export default BoardListPage;