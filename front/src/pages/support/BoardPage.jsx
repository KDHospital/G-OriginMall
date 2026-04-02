import React, { useEffect, useState } from "react";
// 💡 API와 컴포넌트 경로가 실제 위치와 맞는지 꼭 확인하세요!
import { fetchBoard } from "../../api/boardApi"; 
import PaginationComponent from "../../components/support/PaginationComponent"; 

const BoardPage = () => {
  // 1. 상태 관리
  const [serverData, setServerData] = useState(null); // 페이징용 전체 데이터
  const [posts, setPosts] = useState([]);             // 게시글 목록
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;

  // 2. 데이터 호출 함수
  const loadBoardData = async (page) => {
    setLoading(true);
    try {
      // 서버는 0번부터 시작하므로 page - 1
      const data = await fetchBoard(page - 1, itemsPerPage);
      
      // 백엔드 PageResponseDTO 구조 연동
      setPosts(data.dtoList || []);
      setServerData(data); 
    } catch (error) {
      console.error("공지사항 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. 초기 데이터 로드
  useEffect(() => {
    loadBoardData(1);
  }, []);

  // 4. 페이지 이동 핸들러 (PaginationComponent에서 호출)
  const handleChangePage = (pageParam) => {
    // 인자가 객체 { page: n }로 올 경우와 숫자로 올 경우 모두 대응
    const targetPage = pageParam.page || pageParam;
    loadBoardData(targetPage);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">공지사항</h1>

      {/* 테이블 영역 */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-center w-20">번호</th>
              <th className="px-6 py-4">제목</th>
              <th className="px-6 py-4 text-center w-32">등록일</th>
              <th className="px-6 py-4 text-center w-24">조회수</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center py-10">로딩 중...</td></tr>
            ) : posts.length > 0 ? (
              posts.map((post, index) => (
                <tr key={post.postId} className="border-b hover:bg-gray-50 cursor-pointer">
                  {/* 역순 번호 계산식 */}
                  <td className="px-6 py-4 text-center text-gray-400">
                    {serverData ? serverData.totalCount - (serverData.current - 1) * itemsPerPage - index : ""}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                  <td className="px-6 py-4 text-center">{post.regDate || "2026-04-01"}</td>
                  <td className="px-6 py-4 text-center">{post.viewCount || 0}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center py-20">게시글이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 5. 페이징 노출: serverData가 있을 때만 렌더링 */}
      {serverData && (
        <PaginationComponent 
          serverData={serverData} 
          movePage={handleChangePage} 
        />
      )}
    </div>
  );
};

export default BoardPage;