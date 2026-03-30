import React, { useState, useEffect } from 'react';
import BasicLayout from '../../layouts/BasicLayout';
import PaginationComponent from '../../components/support/PaginationComponent';
import { fetchNotice } from '../../api/boardApi'; 

const BoardPage = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // DTO 필드명(postId, writerName, createdAt, viewCount)을 반영한 로드 함수 [cite: 2026-03-30]
  const loadBoardData = async (page) => {
    try {
      // API 호출 시 page는 0부터 시작하므로 page - 1 처리
      const response = await fetchNotice(page - 1, itemsPerPage);
      
      // 서버 응답에서 dtoList를 추출 (PostDetailResponseDTO 리스트)
      setPosts(response.dtoList || []);
      setTotalItems(response.totalElements || 0);
    } catch (error) {
      console.error("게시판 목록 로드 실패:", error);
      setPosts([]);
    }
  };

  useEffect(() => {
    loadBoardData(currentPage);
  }, [currentPage]);

  return (
    <BasicLayout>
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* 게시판 헤더 */}
        <div className="mb-8 border-b-2 border-[#1D3C28] pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">자유게시판</h1>
            <p className="text-gray-500 mt-2 text-sm">지오리진 몰의 다양한 소식을 공유하세요.</p>
          </div>
          <button className="bg-[#1D3C28] text-white px-6 py-2 rounded-sm text-sm hover:bg-[#2d5a3c] transition-colors">
            글쓰기
          </button>
        </div>

        {/* 게시판 리스트 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 uppercase text-xs">
                <th className="py-4 px-2 w-16 font-medium">No.</th>
                <th className="py-4 px-4 text-left font-medium">제목</th>
                <th className="py-4 px-4 w-32 font-medium">작성자</th>
                <th className="py-4 px-4 w-28 font-medium">날짜</th>
                <th className="py-4 px-4 w-20 font-medium">조회</th>
              </tr>
            </thead>
            <tbody>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr 
                    key={post.postId} // id 대신 postId 사용 [cite: 2026-03-30]
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="py-5 text-center text-gray-400">{post.postId}</td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-800 font-medium">{post.title}</span>
                        {/* 답변이 있는 경우 작은 아이콘 표시 (DTO 활용) */}
                        {post.answerContent && !post.isDeleted && (
                          <span className="bg-gray-100 text-[10px] px-1.5 py-0.5 rounded text-gray-500">답변완료</span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center text-gray-600">{post.writerName}</td> 
                    <td className="py-5 px-4 text-center text-gray-400 font-light">
                      {/* LocalDateTime 포맷팅 [cite: 2026-03-30] */}
                      {post.createdAt ? post.createdAt.split('T')[0] : '-'}
                    </td>
                    <td className="py-5 px-4 text-center text-gray-400">{post.viewCount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-20 text-center text-gray-300">게시글이 존재하지 않습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 하단 페이지네이션 */}
        <div className="mt-10">
          <PaginationComponent 
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </BasicLayout>
  );
};

export default BoardPage;