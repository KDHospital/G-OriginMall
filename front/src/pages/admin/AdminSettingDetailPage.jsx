import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { adminGetAdminDetail, adminUpdateAdmin, adminDeleteAdmin } from '../../api/memberApi';

const AdminSettingDetailPage = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ mname: '', tel: '', mpwd: '', mpwdConfirm: '' });
  const [saving, setSaving] = useState(false);

  const formatTel = (value) => {
    const nums = value.replace(/[^0-9]/g, '').slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
  };

  useEffect(() => {
    if (!memberId) return;
    setLoading(true);
    adminGetAdminDetail(memberId)
      .then(data => {
        setAdmin(data);
        setForm({ mname: data.mname || '', tel: data.tel || '', mpwd: '', mpwdConfirm: '' });
      })
      .catch(err => console.error("관리자 상세 조회 실패:", err))
      .finally(() => setLoading(false));
  }, [memberId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'tel' ? formatTel(value) : value });
  };

  const handleSave = async () => {
    if (!form.mname.trim()) return alert("이름을 입력해주세요.");
    if (!form.tel.trim()) return alert("연락처를 입력해주세요.");
    if (form.mpwd && form.mpwd.length < 8) return alert("비밀번호는 8자 이상이어야 합니다.");
    if (form.mpwd && form.mpwd !== form.mpwdConfirm) return alert("비밀번호가 일치하지 않습니다.");

    setSaving(true);
    try {
      const data = { mname: form.mname.trim(), tel: form.tel.trim() };
      if (form.mpwd) data.mpwd = form.mpwd;
      await adminUpdateAdmin(memberId, data);
      alert("관리자 정보가 수정되었습니다.");
      setEditing(false);
      // reload
      const updated = await adminGetAdminDetail(memberId);
      setAdmin(updated);
    } catch (error) {
      alert(error.response?.data?.message || "수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("이 관리자 계정을 비활성화하시겠습니까?")) return;
    try {
      await adminDeleteAdmin(memberId);
      alert("관리자 계정이 비활성화되었습니다.");
      navigate('/admin/admins');
    } catch (error) {
      alert("삭제에 실패했습니다.");
    }
  };

  const formatDateTime = (dt) => dt ? dt.replace('T', ' ').slice(0, 16) : '-';

  if (loading) return <AdminLayout><div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen"><div className="py-24 text-center text-gray-400">데이터를 불러오는 중입니다...</div></div></AdminLayout>;
  if (!admin) return <AdminLayout><div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen"><div className="py-24 text-center text-gray-400">관리자 정보를 찾을 수 없습니다.</div></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="mb-4 text-sm text-gray-400">회원 관리 &gt; 관리자설정 &gt; <span className="text-gray-600 font-semibold">관리자 상세</span></div>

        <div className="space-y-5">
          <div className="flex justify-between items-end">
            <div>
              <button onClick={() => navigate('/admin/admins')} className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-1 flex items-center gap-1"><span>←</span> 목록으로</button>
              <h2 className="text-2xl font-bold text-gray-900">관리자 상세</h2>
            </div>
            <div className="flex gap-2">
              {!editing ? (
                <button onClick={() => setEditing(true)} className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">수정</button>
              ) : (
                <>
                  <button onClick={() => { setEditing(false); setForm({ mname: admin.mname, tel: admin.tel, mpwd: '', mpwdConfirm: '' }); }} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">취소</button>
                  <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">{saving ? '저장 중...' : '저장'}</button>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-600 mb-3">관리자</span>
              <h3 className="text-xl font-bold text-gray-900">{admin.mname}</h3>
              <p className="text-sm text-gray-400 mt-1">{admin.loginId}</p>
            </div>

            <div className="px-6 py-5 space-y-5">
              {!editing ? (
                <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">아이디</label>
                    <p className="text-sm text-gray-800">{admin.loginId}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">이름</label>
                    <p className="text-sm text-gray-800">{admin.mname}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">이메일</label>
                    <p className="text-sm text-gray-800">{admin.email}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">연락처</label>
                    <p className="text-sm text-gray-800">{admin.tel}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">등록일</label>
                    <p className="text-sm text-gray-800">{formatDateTime(admin.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">최근 수정일</label>
                    <p className="text-sm text-gray-800">{formatDateTime(admin.updatedAt)}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">아이디 (변경불가)</label>
                    <input value={admin.loginId} disabled className="w-full max-w-md px-4 py-2.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">이름</label>
                      <input name="mname" value={form.mname} onChange={handleChange} type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">연락처</label>
                      <input name="tel" value={form.tel} onChange={handleChange} type="text" placeholder="010-0000-0000" maxLength={13} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-5">
                    <p className="text-xs text-gray-400 mb-3">비밀번호 변경 (변경하지 않으려면 비워두세요)</p>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">새 비밀번호</label>
                        <input name="mpwd" value={form.mpwd} onChange={handleChange} type="password" placeholder="8~20자, 영문+숫자 또는 특수문자 포함" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">새 비밀번호 확인</label>
                        <input name="mpwdConfirm" value={form.mpwdConfirm} onChange={handleChange} type="password" placeholder="비밀번호 재입력" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingDetailPage;
