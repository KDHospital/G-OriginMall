import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import PaginationComponent from '../../components/support/PaginationComponent';
import { adminGetAdmins, adminDeleteAdmin } from '../../api/memberApi';

import { fmtTel } from '../../util/adminFormatUtil';
import { DEFAULT_ITEMS_PER_PAGE } from '../../util/boardConstants';

const AdminSettingListPage = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = DEFAULT_ITEMS_PER_PAGE;

  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = (e) => setSelectedIds(e.target.checked ? admins.map(a => a.id) : []);
  const handleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleDelete = async () => {
    if (selectedIds.length === 0) return alert("탈퇴 처리할 관리자를 선택해주세요.");
    const alreadyDeleted = admins.filter(a => selectedIds.includes(a.id) && a.isDeleted);
    if (alreadyDeleted.length > 0) return alert("이미 탈퇴한 회원이 포함되어 있습니다.");
    if (!window.confirm("선택한 관리자를 탈퇴 처리 할까요?")) return;
    try {
      await Promise.all(selectedIds.map(id => adminDeleteAdmin(id)));
      alert("처리되었습니다.");
      setSelectedIds([]);
      loadData(currentPage);
    } catch { alert("탈퇴 처리 중 오류가 발생했습니다."); }
  };

  const loadData = async (page, kw = keyword, status = filterStatus) => {
    setLoading(true);
    try {
      const data = await adminGetAdmins(page - 1, itemsPerPage, kw, status);
      setAdmins(data.dtoList || []);
      setTotalItems(data.totalCount || 0);
    } catch (error) {
      console.error("관리자 목록 로드 실패:", error);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setSelectedIds([]); loadData(currentPage); }, [currentPage]);

  const handleSearch = () => { setKeyword(searchInput); setCurrentPage(1); loadData(1, searchInput, filterStatus); };
  const handleSearchKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };
  const handleSearchClear = () => { setSearchInput(''); setKeyword(''); setFilterStatus(''); setCurrentPage(1); loadData(1, '', ''); };
  const handleFilterStatus = (v) => { setFilterStatus(v); setCurrentPage(1); loadData(1, keyword, v); };

  return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="mb-4 text-sm text-gray-400">회원 관리 &gt; <span className="text-gray-600 font-semibold">관리자</span></div>

        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">관리자</h2>
          </div>

          <div className="flex items-center gap-2">
            <select value={filterStatus} onChange={(e) => handleFilterStatus(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none bg-white focus:border-blue-300 text-gray-700">
              <option value="">회원상태 전체</option>
              <option value="active">활성</option>
              <option value="withdrawn">탈퇴</option>
            </select>
            <div className="relative flex-1 max-w-sm">
              <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleSearchKeyDown}
                placeholder="이름, 아이디, 이메일 검색"
                className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all bg-white" />
              {searchInput && <button onClick={handleSearchClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">✕</button>}
            </div>
            <button onClick={handleSearch} className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">검색</button>
            {keyword && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>"{keyword}" ({totalItems}명)</span>
                <button onClick={handleSearchClear} className="text-blue-600 hover:text-blue-800 font-semibold">전체보기</button>
              </div>
            )}
            <div className="flex gap-2 ml-auto">
              <button onClick={handleDelete} disabled={selectedIds.length === 0}
                className={`px-4 py-2.5 text-sm font-semibold rounded-lg border transition-colors ${selectedIds.length > 0 ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'}`}>
                탈퇴
              </button>
              <button onClick={() => navigate('/admin/admins/new')} className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">등록</button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="text-center py-24 text-gray-400">불러오는 중...</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="pl-5 pr-2 py-4 w-10"><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === admins.length && admins.length > 0} className="rounded border-gray-300" /></th>
                    <th className="px-3 py-4 w-14 text-center font-semibold">No.</th>
                    <th className="px-4 py-4 w-20 text-center font-semibold">상태</th>
                    <th className="px-4 py-4 w-40 text-center font-semibold">이름</th>
                    <th className="px-4 py-4 text-left font-semibold">아이디(이메일)</th>
                    <th className="px-4 py-4 w-32 text-center font-semibold">연락처</th>
                    <th className="px-4 py-4 w-28 text-center font-semibold">등록일</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length === 0 ? (
                    <tr><td colSpan={7} className="py-24 text-center text-gray-400">등록된 관리자가 없습니다.</td></tr>
                  ) : admins.map((admin, idx) => {
                    const virtualNo = totalItems - (currentPage - 1) * itemsPerPage - idx;
                    return (
                      <tr key={admin.id} className="border-b border-gray-50 transition-colors cursor-pointer hover:bg-gray-50/70"
                        onClick={() => navigate(`/admin/admins/${admin.id}`)}>
                        <td className="pl-5 pr-2 py-4" onClick={e => e.stopPropagation()}>
                          <input type="checkbox" checked={selectedIds.includes(admin.id)} onChange={() => handleSelect(admin.id)} className="rounded border-gray-300" />
                        </td>
                        <td className="px-3 py-4 text-center text-gray-400 font-mono text-xs">{virtualNo}</td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${admin.isDeleted ? 'bg-gray-100 text-gray-500' : 'bg-emerald-50 text-emerald-600'}`}>
                            {admin.isDeleted ? '탈퇴' : '활성'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center font-medium text-gray-800">{admin.mname}</td>
                        <td className="px-4 py-4 text-left text-gray-600">{admin.loginId}</td>
                        <td className="px-4 py-4 text-center text-gray-500 text-xs">{fmtTel(admin.tel)}</td>
                        <td className="px-4 py-4 text-center text-gray-400 text-xs">{admin.createdAt?.split('T')[0]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <PaginationComponent currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={(page) => setCurrentPage(page)} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingListPage;
