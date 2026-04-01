import React, { useState, useEffect } from 'react';
import BasicLayout from '../../layouts/BasicLayout';
import UserSupportComponent from '../../components/support/UserSupportComponent';
import PaginationComponent from '../../components/support/PaginationComponent';
import { fetchNotice } from '../../api/boardApi'; 

const BoardPage = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const loadBoardData = async (page) => {
    try {
      // fetchNotice 함수 호출
      const response = await fetchNotice(page - 1, itemsPerPage);
      setPosts(response.dtoList || []);
      setTotalItems(response.totalElements || 0);
    } catch (error) {
      console.error("공지사항 로드 실패:", error);
      setPosts([]);
    }
  };

  useEffect(() => {
    loadBoardData(currentPage);
  }, [currentPage]);

  return (
    <BasicLayout>
      <UserSupportComponent title="공지사항" description="지오리진 몰의 새로운 소식을 전해드립니다.">
        <div className="w-full">
          <div className="border-t-2 border-gray-800">
            <table className="w-full text-[13px] border-collapse table-fixed">
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
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post.postId} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                      <td className="py-5 text-center text-gray-400 font-light">{post.postId}</td>
                      <td className="py-5 px-6 text-left text-gray-700 truncate font-medium">{post.title}</td>
                      <td className="py-5 text-center text-gray-500">{post.writerName}</td>
                      <td className="py-5 text-center text-gray-400 font-light">
                        {post.createdAt ? post.createdAt.split('T')[0] : '-'}
                      </td>
                      <td className="py-5 text-center text-gray-400">{post.viewCount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-20 text-center text-gray-300">등록된 공지사항이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="py-10">
            <PaginationComponent 
              currentPage={currentPage} 
              totalItems={totalItems} 
              itemsPerPage={itemsPerPage} 
              onPageChange={setCurrentPage} 
            />
          </div>
        </div>
      </UserSupportComponent>
    </BasicLayout>
  );
};

export default BoardPage;