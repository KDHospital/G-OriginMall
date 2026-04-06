import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { adminCreateAdmin } from '../../api/memberApi';

const AdminSettingAddPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ loginId: '', mname: '', mpwd: '', mpwdConfirm: '', tel: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const formatTel = (value) => {
    const nums = value.replace(/[^0-9]/g, '').slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'tel' ? formatTel(value) : value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const pwdRegex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*]).{8,20}$/;
  const validatePwd = () => {
    const newErrors = {};
    if (form.mpwd && !pwdRegex.test(form.mpwd)) newErrors.mpwd = '8~20자, 영문과 숫자 또는 특수문자를 포함해야 합니다.';
    if (form.mpwdConfirm && form.mpwd !== form.mpwdConfirm) newErrors.mpwdConfirm = '비밀번호가 일치하지 않습니다.';
    setErrors(prev => ({ ...prev, ...newErrors }));
  };

  const handleSubmit = async () => {
    if (!form.loginId.trim()) return alert("아이디를 입력해주세요.");
    if (!form.mname.trim()) return alert("이름을 입력해주세요.");
    if (!form.mpwd) return alert("비밀번호를 입력해주세요.");
    if (!pwdRegex.test(form.mpwd)) return alert("비밀번호 조건을 확인해주세요.");
    if (form.mpwd !== form.mpwdConfirm) return alert("비밀번호가 일치하지 않습니다.");
    if (!form.tel.trim()) return alert("연락처를 입력해주세요.");
    if (!form.email.trim()) return alert("이메일을 입력해주세요.");

    setSaving(true);
    try {
      await adminCreateAdmin({ loginId: form.loginId.trim(), mname: form.mname.trim(), mpwd: form.mpwd, tel: form.tel.trim(), email: form.email.trim() });
      alert("관리자가 등록되었습니다.");
      navigate('/admin/admins');
    } catch (error) {
      alert(error.response?.data?.message || "등록 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="mb-4 text-sm text-gray-400">회원 관리 &gt; 관리자설정 &gt; <span className="text-gray-600 font-semibold">관리자 등록</span></div>
        <div className="space-y-5">
          <div className="flex justify-between items-end">
            <div>
              <button onClick={() => navigate('/admin/admins')} className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-1 flex items-center gap-1"><span>←</span> 목록으로</button>
              <h2 className="text-2xl font-bold text-gray-900">관리자 등록</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/admin/admins')} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">취소</button>
              <button onClick={handleSubmit} disabled={saving} className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">{saving ? '등록 중...' : '등록'}</button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">아이디 (로그인 ID)</label>
                <input name="loginId" value={form.loginId} onChange={handleChange} type="text" placeholder="example@email.com" className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">이름</label>
                  <input name="mname" value={form.mname} onChange={handleChange} type="text" placeholder="관리자명" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">이메일</label>
                  <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="example@email.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">비밀번호</label>
                  <input name="mpwd" value={form.mpwd} onChange={handleChange} onBlur={validatePwd} type="password" placeholder="8~20자, 영문+숫자 또는 특수문자 포함"
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 transition-all ${errors.mpwd ? 'border-red-300 focus:border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-blue-300 focus:ring-blue-100'}`} />
                  {errors.mpwd && <p className="text-xs text-red-500 mt-1.5">{errors.mpwd}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">비밀번호 확인</label>
                  <input name="mpwdConfirm" value={form.mpwdConfirm} onChange={handleChange} onBlur={validatePwd} type="password" placeholder="비밀번호 재입력"
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 transition-all ${errors.mpwdConfirm ? 'border-red-300 focus:border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-blue-300 focus:ring-blue-100'}`} />
                  {errors.mpwdConfirm && <p className="text-xs text-red-500 mt-1.5">{errors.mpwdConfirm}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">연락처</label>
                <input name="tel" value={form.tel} onChange={handleChange} type="text" placeholder="010-0000-0000" maxLength={13} className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingAddPage;
