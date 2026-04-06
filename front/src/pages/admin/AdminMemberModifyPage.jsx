import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { adminGetMember, adminUpdateMember } from '../../api/memberApi';

const AdminMemberModifyPage = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ mname: '', tel: '', gender: 0, mpwd: '', mpwdConfirm: '' });
  const [loginId, setLoginId] = useState('');
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!memberId) return;
    setFetching(true);
    adminGetMember(memberId)
      .then(data => {
        setLoginId(data.loginId || '');
        setForm({
          mname: data.mname || '',
          tel: data.tel || '',
          gender: data.gender || 0,
          mpwd: '',
          mpwdConfirm: ''
        });
      })
      .catch(err => {
        console.error("회원 조회 실패:", err);
        alert("회원 정보를 불러올 수 없습니다.");
      })
      .finally(() => setFetching(false));
  }, [memberId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'gender' ? Number(value) : value });
  };

  const handleSubmit = async () => {
    if (!form.mname.trim()) return alert("이름을 입력해주세요.");
    if (!form.tel.trim()) return alert("연락처를 입력해주세요.");
    if (form.mpwd && form.mpwd.length < 8) return alert("비밀번호는 8자 이상 입력해주세요.");
    if (form.mpwd && form.mpwd !== form.mpwdConfirm) return alert("비밀번호가 일치하지 않습니다.");

    setSaving(true);
    try {
      const data = {
        mname: form.mname.trim(),
        tel: form.tel.trim(),
        gender: form.gender
      };
      if (form.mpwd) data.mpwd = form.mpwd;

      await adminUpdateMember(memberId, data);
      alert("회원 정보가 수정되었습니다.");
      navigate(`/admin/members/${memberId}`);
    } catch (error) {
      const msg = error.response?.data?.message || "수정 중 오류가 발생했습니다.";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  if (fetching) return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="py-24 text-center text-gray-400">데이터를 불러오는 중입니다...</div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="mb-4 text-sm text-gray-400">회원 관리 &gt; <span className="text-gray-600 font-semibold">회원 수정</span></div>

        <div className="space-y-5">
          <div className="flex justify-between items-end">
            <div>
              <button onClick={() => navigate(`/admin/members/${memberId}`)} className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-1 flex items-center gap-1">
                <span>←</span> 돌아가기
              </button>
              <h2 className="text-2xl font-bold text-gray-900">회원 수정</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate(`/admin/members/${memberId}`)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">취소</button>
              <button onClick={handleSubmit} disabled={saving} className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">아이디 (변경불가)</label>
                <input value={loginId} disabled
                  className="w-full max-w-md px-4 py-2.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-500" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">이름</label>
                  <input name="mname" value={form.mname} onChange={handleChange} type="text"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">연락처</label>
                  <input name="tel" value={form.tel} onChange={handleChange} type="text"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">성별</label>
                <select name="gender" value={form.gender} onChange={handleChange}
                  className="w-full max-w-xs px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all">
                  <option value={0}>미지정</option>
                  <option value={1}>남성</option>
                  <option value={2}>여성</option>
                </select>
              </div>
              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs text-gray-400 mb-3">비밀번호 변경 (변경하지 않으려면 비워두세요)</p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">새 비밀번호</label>
                    <input name="mpwd" value={form.mpwd} onChange={handleChange} type="password" placeholder="8~20자, 영문+숫자 또는 특수문자 포함"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">새 비밀번호 확인</label>
                    <input name="mpwdConfirm" value={form.mpwdConfirm} onChange={handleChange} type="password" placeholder="비밀번호 재입력"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMemberModifyPage;
