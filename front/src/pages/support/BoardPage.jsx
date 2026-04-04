import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import BasicLayout from '../../layouts/BasicLayout';
import UserSupportComponent from '../../components/support/UserSupportComponent';
import PaginationComponent from '../../components/support/PaginationComponent';
import { fetchBoard } from '../../api/boardApi'; 

const BoardPage = () => {
  const navigate = useNavigate(); 
  const [posts, setPosts] = useState([]);
  const [serverData, setServerData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const loadBoardData = async (page) => {
    try {
      const response = await fetchBoard(page - 1, itemsPerPage);
      setPosts(response.dtoList || []);
      setTotalItems(response.totalCount || 0); 
      setServerData(response); 
      setCurrentPage(page);
    } catch (error) {
      console.error("공지사항 로드 실패:", error);
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
                  posts.map((post, index) => (
                    <tr 
                      key={post.postId || index} 
                      className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                      // 💡 상세 이동: postId가 확실히 있을 때만 navigate 실행
                      onClick={() => {
                        if (post.postId) navigate(`/board/read/${post.postId}`);
                      }}
                    >
                      <td className="py-5 text-center text-gray-400 font-light">
                        {/* 💡 '//' 제거: 순수 계산식만 남깁니다 */}
                        {(totalItems || 0) - ((currentPage || 1) - 1) * itemsPerPage - index}
                      </td>
                      <td className="py-5 px-6 text-left text-gray-700 truncate font-medium">
                        {post.title}
                      </td>
                      <td className="py-5 text-center text-gray-500">
                        {/* 💡 작성자 노출 로직 */}
                        {post.member?.name || post.member?.nickname || '관리자'}
                      </td>
                      <td className="py-5 text-center text-gray-400 font-light">
                        {post.createdAt ? post.createdAt.split('T')[0] : '-'}
                      </td>
                      <td className="py-5 text-center text-gray-400">{post.viewCount || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="py-20 text-center text-gray-300">등록된 공지사항이 없습니다.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="py-10">
            {/* 💡 페이지네이션 복구: serverData가 있을 때만 노출 */}
            {serverData && (
              <PaginationComponent 
                serverData={serverData} 
                movePage={(pageParam) => setCurrentPage(pageParam.page || pageParam)} 
              />
            )}
          </div>
        </div>
      </UserSupportComponent>
    </BasicLayout>
  );
};

export default BoardPage;