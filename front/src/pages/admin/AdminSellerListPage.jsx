import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import PaginationComponent from '../../components/support/PaginationComponent';
import { adminGetSellers, adminApproveSeller, adminUpdateSeller, adminDeleteMember } from '../../api/memberApi';

import { fmtBizNo, fmtTel } from '../../util/adminFormatUtil';

const AdminSellerListPage = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [filterVerified, setFilterVerified] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const loadData = async (page, kw = keyword, verified = filterVerified, status = filterStatus) => {
    setLoading(true);
    try {
      const data = await adminGetSellers(page - 1, itemsPerPage, kw, verified, status);
      setSellers(data.dtoList || []);
      setTotalItems(data.totalCount || 0);
    } catch (error) {
      console.error("판매회원 목록 로드 실패:", error);
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedIds([]);
    loadData(currentPage);
  }, [currentPage]);

  const handleSearch = () => {
    setKeyword(searchInput);
    setCurrentPage(1);
    loadData(1, searchInput, filterVerified, filterStatus);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSearchClear = () => {
    setSearchInput('');
    setKeyword('');
    setFilterVerified(null);
    setFilterStatus('');
    setCurrentPage(1);
    loadData(1, '', null, '');
  };

  const handleFilterVerified = (v) => {
    setFilterVerified(v);
    setCurrentPage(1);
    loadData(1, keyword, v, filterStatus);
  };

  const handleFilterStatus = (v) => {
    setFilterStatus(v);
    setCurrentPage(1);
    loadData(1, keyword, filterVerified, v);
  };

  const handleSelectAll = (e) => setSelectedIds(e.target.checked ? sellers.map(s => s.id) : []);
  const handleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return alert("승인할 판매자를 선택해주세요.");
    if (!window.confirm("선택한 판매자를 일괄 승인하시겠습니까?")) return;
    try {
      await Promise.all(selectedIds.map(id => adminApproveSeller(id)));
      alert("일괄 승인되었습니다.");
      setSelectedIds([]);
      loadData(currentPage);
    } catch {
      alert("승인 처리 중 오류가 발생했습니다.");
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return alert("미승인할 판매자를 선택해주세요.");
    if (!window.confirm("선택한 판매자를 미승인 처리하시겠습니까?")) return;
    try {
      await Promise.all(selectedIds.map(id =>
        adminUpdateSeller(id, { businessVerified: false })
      ));
      alert("일괄 미승인 처리되었습니다.");
      setSelectedIds([]);
      loadData(currentPage);
    } catch {
      alert("미승인 처리 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return alert("탈퇴 처리할 판매자를 선택해주세요.");
    const alreadyDeleted = sellers.filter(s => selectedIds.includes(s.id) && s.isDeleted);
    if (alreadyDeleted.length > 0) return alert("이미 탈퇴한 회원이 포함되어 있습니다.");
    if (!window.confirm("선택한 판매자를 탈퇴 처리 할까요?")) return;
    try {
      await Promise.all(selectedIds.map(id => adminDeleteMember(id)));
      alert("처리되었습니다.");
      setSelectedIds([]);
      loadData(currentPage);
    } catch {
      alert("탈퇴 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="mb-4 text-sm text-gray-400">회원 관리 &gt; <span className="text-gray-600 font-semibold">판매회원</span></div>

        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">판매회원 관리</h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select value={filterStatus} onChange={(e) => handleFilterStatus(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none bg-white focus:border-blue-300 text-gray-700">
              <option value="">회원상태 전체</option>
              <option value="active">활성</option>
              <option value="withdrawn">탈퇴</option>
            </select>
            <select value={filterVerified === null ? '' : String(filterVerified)} onChange={(e) => handleFilterVerified(e.target.value === '' ? null : e.target.value === 'true')}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none bg-white focus:border-blue-300 text-gray-700">
              <option value="">승인여부 전체</option>
              <option value="false">미승인</option>
              <option value="true">승인</option>
            </select>
            <div className="relative flex-1 max-w-sm">
              <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleSearchKeyDown}
                placeholder="이름, 아이디, 사업자번호 검색"
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
              <button onClick={handleBulkApprove} disabled={selectedIds.length === 0}
                className={`px-4 py-2.5 text-sm font-semibold rounded-lg border transition-colors ${selectedIds.length > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'}`}>일괄승인</button>
              <button onClick={handleBulkReject} disabled={selectedIds.length === 0}
                className={`px-4 py-2.5 text-sm font-semibold rounded-lg border transition-colors ${selectedIds.length > 0 ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'}`}>일괄미승인</button>
              <button onClick={handleDelete} disabled={selectedIds.length === 0}
                className={`px-4 py-2.5 text-sm font-semibold rounded-lg border transition-colors ${selectedIds.length > 0 ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'}`}>탈퇴</button>
              <button onClick={() => navigate('/admin/sellers/new')} className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">등록</button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="text-center py-24 text-gray-400">불러오는 중...</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="pl-5 pr-2 py-4 w-10"><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === sellers.length && sellers.length > 0} className="rounded border-gray-300" /></th>
                    <th className="px-3 py-4 w-14 text-center font-semibold">No.</th>
                    <th className="px-4 py-4 w-20 text-center font-semibold">상태</th>
                    <th className="px-4 py-4 w-24 text-center font-semibold">승인여부</th>
                    <th className="px-4 py-4 w-40 text-center font-semibold">이름</th>
                    <th className="px-4 py-4 text-left font-semibold">아이디</th>
                    <th className="px-4 py-4 w-32 text-center font-semibold">사업자번호</th>
                    <th className="px-4 py-4 w-32 text-center font-semibold">연락처</th>
                    <th className="px-4 py-4 w-28 text-center font-semibold">가입일</th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.length === 0 ? (
                    <tr><td colSpan={9} className="py-24 text-center text-gray-400">등록된 판매회원이 없습니다.</td></tr>
                  ) : sellers.map((seller, idx) => {
                    const virtualNo = totalItems - (currentPage - 1) * itemsPerPage - idx;
                    return (
                      <tr key={seller.id} className="border-b border-gray-50 transition-colors cursor-pointer hover:bg-gray-50/70"
                        onClick={() => navigate(`/admin/sellers/${seller.id}`)}>
                        <td className="pl-5 pr-2 py-4" onClick={e => e.stopPropagation()}>
                          <input type="checkbox" checked={selectedIds.includes(seller.id)} onChange={() => handleSelect(seller.id)} className="rounded border-gray-300" />
                        </td>
                        <td className="px-3 py-4 text-center text-gray-400 font-mono text-xs">{virtualNo}</td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${seller.isDeleted ? 'bg-gray-100 text-gray-500' : 'bg-emerald-50 text-emerald-600'}`}>
                            {seller.isDeleted ? '탈퇴' : '활성'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${seller.businessVerified ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                            {seller.businessVerified ? '승인' : '미승인'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center font-medium text-gray-800">{seller.mname}</td>
                        <td className="px-4 py-4 text-left text-gray-600">{seller.loginId}</td>
                        <td className="px-4 py-4 text-center text-gray-500 text-xs">{fmtBizNo(seller.businessNo)}</td>
                        <td className="px-4 py-4 text-center text-gray-500 text-xs">{fmtTel(seller.tel)}</td>
                        <td className="px-4 py-4 text-center text-gray-400 text-xs">{seller.createdAt?.split('T')[0]}</td>
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

export default AdminSellerListPage;
