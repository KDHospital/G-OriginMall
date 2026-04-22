import React, { useState, useEffect } from 'react';
import { fetchAdminBoard, fetchAdminInquiries, adminRemovePost } from '../../api/boardApi';
import PaginationComponent from '../support/PaginationComponent';
import { BOARD_NOTICE, isNoticeBoard } from '../../util/boardConstants';

const BoardListComponent = ({ boardId, onMoveToRead, onMoveToAdd }) => {
  const isNotice = isNoticeBoard(boardId);

  const [posts, setPosts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const [selectedIds, setSelectedIds] = useState([]);

  // 검색 + 필터
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [filterAnswer, setFilterAnswer] = useState(null);
  const [filterPublic, setFilterPublic] = useState(null);

  // 데이터 로드
  const loadData = async (page, searchKeyword = keyword, answerFilter = filterAnswer, publicFilter = filterPublic) => {
    setLoading(true);
    try {
      const data = isNotice
        ? await fetchAdminBoard(page - 1, itemsPerPage, searchKeyword)
        : await fetchAdminInquiries(page - 1, itemsPerPage, searchKeyword, answerFilter, publicFilter);
      setPosts(data.dtoList || []);
      setTotalItems(data.totalCount || 0);
    } catch (error) {
      console.error("목록 로드 실패:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // boardId 변경 시 초기화
  useEffect(() => {
    setSelectedIds([]);
    setSearchInput('');
    setKeyword('');
    setFilterAnswer(null);
    setFilterPublic(null);
    loadData(1, '', null, null);
    setCurrentPage(1);
  }, [boardId]);

  // 페이지 변경 시
  useEffect(() => {
    setSelectedIds([]);
    loadData(currentPage);
  }, [currentPage]);

  // 검색 핸들러
  const handleSearch = () => {
    setKeyword(searchInput);
    setCurrentPage(1);
    loadData(1, searchInput, filterAnswer, filterPublic);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSearchClear = () => {
    setSearchInput('');
    setKeyword('');
    setFilterAnswer(null);
    setFilterPublic(null);
    setCurrentPage(1);
    loadData(1, '', null, null);
  };

  // 필터 핸들러
  const handleFilterAnswer = (value) => {
    setFilterAnswer(value);
    setCurrentPage(1);
    loadData(1, keyword, value, filterPublic);
  };

  const handleFilterPublic = (value) => {
    setFilterPublic(value);
    setCurrentPage(1);
    loadData(1, keyword, filterAnswer, value);
  };

  // 선택 핸들러
  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? posts.map(p => p.postId) : []);
  };

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    if (selectedIds.length === 0) return alert("삭제할 게시글을 선택해주세요.");
    if (!window.confirm("선택한 게시글을 삭제하시겠습니까?")) return;
    try {
      await Promise.all(selectedIds.map(id => adminRemovePost(id)));
      alert("삭제되었습니다.");
      setSelectedIds([]);
      loadData(currentPage);
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 공통 스타일
  const selectClass = "px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none bg-white focus:border-blue-300 text-gray-700";
  const btnPrimary = "px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors";
  const thClass = "px-4 py-4 text-center font-semibold";
  const tdClass = "px-4 py-4 text-center";

  // 삭제 버튼 스타일
  const deleteBtnClass = selectedIds.length > 0
    ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
    : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed';

  // 상태 뱃지 스타일
  const statusBadge = (hasAnswer) => {
    const style = hasAnswer
      ? 'bg-emerald-50 text-emerald-600'
      : 'bg-amber-50 text-amber-600';
    const label = hasAnswer ? '답변완료' : '답변대기';
    return (
      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${style}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-5">

      {/* 페이지 헤더 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {isNotice ? '공지사항 관리' : '고객문의 관리'}
        </h2>
      </div>

      {/* 검색 + 필터 + 액션 버튼 */}
      <div className="flex items-center gap-2">

        {/* 고객문의 전용 필터 */}
        {!isNotice && (
          <>
            <select
              value={filterAnswer === null ? '' : String(filterAnswer)}
              onChange={(e) => handleFilterAnswer(e.target.value === '' ? null : e.target.value === 'true')}
              className={selectClass}
            >
              <option value="">답변 상태 전체</option>
              <option value="false">답변대기</option>
              <option value="true">답변완료</option>
            </select>
            <select
              value={filterPublic === null ? '' : String(filterPublic)}
              onChange={(e) => handleFilterPublic(e.target.value === '' ? null : e.target.value === 'true')}
              className={selectClass}
            >
              <option value="">공개 전체</option>
              <option value="true">공개</option>
              <option value="false">비공개</option>
            </select>
          </>
        )}

        {/* 검색 입력 */}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="제목을 검색하세요"
            className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
          />
          {searchInput && (
            <button
              onClick={handleSearchClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
          )}
        </div>

        <button onClick={handleSearch} className={btnPrimary}>
          검색
        </button>

        {/* 검색 결과 표시 */}
        {keyword && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>
              검색결과: <strong className="text-gray-800">"{keyword}"</strong> ({totalItems}건)
            </span>
            <button
              onClick={handleSearchClear}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              전체보기
            </button>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={handleDelete}
            disabled={selectedIds.length === 0}
            className={`px-4 py-2.5 text-sm font-semibold rounded-lg border transition-colors ${deleteBtnClass}`}
          >
            삭제
          </button>
          {isNotice && (
            <button onClick={onMoveToAdd} className={btnPrimary}>
              등록
            </button>
          )}
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-24 text-gray-400">불러오는 중...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="pl-5 pr-2 py-4 w-10">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIds.length === posts.length && posts.length > 0}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className={`px-3 py-4 w-14 ${thClass}`}>No.</th>
                {!isNotice && <th className={`px-3 py-4 w-24 ${thClass}`}>상태</th>}
                <th className="px-4 py-4 text-left font-semibold">제목</th>
                <th className={`w-40 ${thClass}`}>작성자</th>
                <th className={`w-28 ${thClass}`}>작성일</th>
                <th className={`w-16 ${thClass}`}>조회</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td
                    colSpan={isNotice ? 6 : 7}
                    className="py-24 text-center text-gray-400"
                  >
                    등록된 게시글이 없습니다.
                  </td>
                </tr>
              ) : (
                posts.map((post, idx) => {
                  const virtualNo = totalItems - (currentPage - 1) * itemsPerPage - idx;
                  return (
                    <tr
                      key={post.postId}
                      className="border-b border-gray-50 transition-colors cursor-pointer hover:bg-gray-50/70"
                      onClick={() => onMoveToRead(post.postId)}
                    >
                      {/* 체크박스 */}
                      <td className="pl-5 pr-2 py-4" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(post.postId)}
                          onChange={() => handleSelect(post.postId)}
                          className="rounded border-gray-300"
                        />
                      </td>

                      {/* 번호 */}
                      <td className="px-3 py-4 text-center text-gray-400 font-mono text-xs">
                        {virtualNo}
                      </td>

                      {/* 상태 (고객문의만) */}
                      {!isNotice && (
                        <td className="px-3 py-4 text-center">
                          {statusBadge(post.hasAnswer)}
                        </td>
                      )}

                      {/* 제목 */}
                      <td className="px-4 py-4 text-left">
                        <div className="flex items-center gap-2">
                          {!post.isPublic && <span className="text-xs text-gray-400">🔒</span>}
                          <span className="text-gray-800 font-medium truncate">
                            {post.title}
                          </span>
                        </div>
                      </td>

                      {/* 작성자 */}
                      <td className={`${tdClass} text-gray-500`}>
                        {post.mName || '관리자'}
                      </td>

                      {/* 작성일 */}
                      <td className={`${tdClass} text-gray-400 text-xs`}>
                        {post.createdAt?.split('T')[0]}
                      </td>

                      {/* 조회수 */}
                      <td className={`${tdClass} text-gray-400 text-xs`}>
                        {post.viewCount || 0}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* 페이지네이션 */}
      <PaginationComponent
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default BoardListComponent;
