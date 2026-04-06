import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import PaginationComponent from '../../components/support/PaginationComponent';
import { adminGetMembers } from '../../api/memberApi';

const AdminMemberListPage = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const loadData = async (page, searchKeyword = keyword, status = filterStatus) => {
    setLoading(true);
    try {
      const data = await adminGetMembers(page - 1, itemsPerPage, searchKeyword, status);
      setMembers(data.dtoList || []);
      setTotalItems(data.totalCount || 0);
    } catch (error) {
      console.error("회원 목록 로드 실패:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  const handleSearch = () => {
    setKeyword(searchInput);
    setCurrentPage(1);
    loadData(1, searchInput, filterStatus);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSearchClear = () => {
    setSearchInput('');
    setKeyword('');
    setFilterStatus('');
    setCurrentPage(1);
    loadData(1, '', '');
  };

  const handleFilterStatus = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
    loadData(1, keyword, value);
  };

  const formatGender = (gender) => {
    if (gender === 1) return '남';
    if (gender === 2) return '여';
    return '-';
  };

  return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="mb-4 text-sm text-gray-400"><span className="text-gray-600 font-semibold">회원 관리</span></div>

        <div className="space-y-5">
          {/* 페이지 헤더 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">회원 관리</h2>
            <p className="text-sm text-gray-400 mt-1">총 {totalItems}명의 일반 회원이 있습니다.</p>
          </div>

          {/* 검색 + 필터 */}
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => handleFilterStatus(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none bg-white focus:border-blue-300 text-gray-700"
            >
              <option value="">상태 전체</option>
              <option value="active">활성</option>
              <option value="withdrawn">탈퇴</option>
            </select>
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="이름, 아이디, 이메일 검색"
                className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
              />
              {searchInput && (
                <button onClick={handleSearchClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                  ✕
                </button>
              )}
            </div>
            <button onClick={handleSearch} className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
              검색
            </button>
            {keyword && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>검색결과: <strong className="text-gray-800">"{keyword}"</strong> ({totalItems}명)</span>
                <button onClick={handleSearchClear} className="text-blue-600 hover:text-blue-800 font-semibold">전체보기</button>
              </div>
            )}
            <button onClick={() => navigate('/admin/members/new')} className="ml-auto px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
              등록
            </button>
          </div>

          {/* 테이블 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="text-center py-24 text-gray-400">불러오는 중...</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-5 py-4 w-14 text-center font-semibold">No.</th>
                    <th className="px-4 py-4 w-20 text-center font-semibold">상태</th>
                    <th className="px-4 py-4 w-28 text-center font-semibold">이름</th>
                    <th className="px-4 py-4 text-left font-semibold">아이디(이메일)</th>
                    <th className="px-4 py-4 w-32 text-center font-semibold">연락처</th>
                    <th className="px-4 py-4 w-16 text-center font-semibold">성별</th>
                    <th className="px-4 py-4 w-28 text-center font-semibold">가입일</th>
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-24 text-center text-gray-400">등록된 회원이 없습니다.</td>
                    </tr>
                  ) : (
                    members.map((member, idx) => {
                      const virtualNo = totalItems - (currentPage - 1) * itemsPerPage - idx;
                      return (
                        <tr
                          key={member.id}
                          className="border-b border-gray-50 transition-colors cursor-pointer hover:bg-gray-50/70"
                          onClick={() => navigate(`/admin/members/${member.id}`)}
                        >
                          <td className="px-5 py-4 text-center text-gray-400 font-mono text-xs">{virtualNo}</td>
                          <td className="px-4 py-4 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                              member.isDeleted ? 'bg-gray-100 text-gray-500' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                              {member.isDeleted ? '탈퇴' : '활성'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center font-medium text-gray-800">{member.mname}</td>
                          <td className="px-4 py-4 text-left text-gray-600">{member.loginId}</td>
                          <td className="px-4 py-4 text-center text-gray-500 text-xs">{member.tel}</td>
                          <td className="px-4 py-4 text-center text-gray-500">{formatGender(member.gender)}</td>
                          <td className="px-4 py-4 text-center text-gray-400 text-xs">{member.createdAt?.split('T')[0]}</td>
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
      </div>
    </AdminLayout>
  );
};

export default AdminMemberListPage;
