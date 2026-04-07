import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { adminGetMember, adminUpdateMember } from '../../api/memberApi';

const ic = "w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 transition-all";
const Label = ({ text, required }) => (
  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{text}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
);

const AdminMemberModifyPage = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ mname: '', tel: '', gender: 0, mpwd: '', mpwdConfirm: '' });
  const [loginId, setLoginId] = useState('');
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formatTel = (v) => { const n = v.replace(/[^0-9]/g, '').slice(0, 11); if (n.length <= 3) return n; if (n.length <= 7) return `${n.slice(0, 3)}-${n.slice(3)}`; return `${n.slice(0, 3)}-${n.slice(3, 7)}-${n.slice(7)}`; };

  useEffect(() => {
    if (!memberId) return;
    setFetching(true);
    adminGetMember(memberId)
      .then(data => { setLoginId(data.loginId || ''); setForm({ mname: data.mname || '', tel: data.tel || '', gender: data.gender || 0, mpwd: '', mpwdConfirm: '' }); })
      .catch(() => alert("회원 정보를 불러올 수 없습니다."))
      .finally(() => setFetching(false));
  }, [memberId]);

  const handleChange = (e) => { const { name, value } = e.target; setForm({ ...form, [name]: name === 'tel' ? formatTel(value) : name === 'gender' ? Number(value) : value }); };

  const pwdRegex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*]).{8,20}$/;
  const errs = {
    mname: !form.mname.trim() ? '이름을 입력해주세요.' : '',
    tel: !form.tel.trim() ? '연락처를 입력해주세요.' : '',
    mpwd: form.mpwd && !pwdRegex.test(form.mpwd) ? '8~20자, 영문과 숫자 또는 특수문자(!@#$%^&*)를 포함해야 합니다.' : '',
    mpwdConfirm: form.mpwd && form.mpwd !== form.mpwdConfirm ? '비밀번호가 일치하지 않습니다.' : '',
  };
  const hasErr = (f) => submitted && errs[f];
  const liveErr = (f) => { if (f === 'mpwd') return form.mpwd && !pwdRegex.test(form.mpwd); if (f === 'mpwdConfirm') return form.mpwdConfirm && form.mpwd !== form.mpwdConfirm; return false; };
  const cls = (f) => `${ic} ${hasErr(f) || liveErr(f) ? 'border-red-300 focus:border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-blue-300 focus:ring-blue-100'}`;
  const errMsg = (f) => (hasErr(f) || liveErr(f)) ? (errs[f] || '') : '';

  const handleSubmit = async () => {
    setSubmitted(true);
    if (errs.mname || errs.tel || errs.mpwd || errs.mpwdConfirm) return;
    setSaving(true);
    try {
      const data = { mname: form.mname.trim(), tel: form.tel.trim(), gender: form.gender };
      if (form.mpwd) data.mpwd = form.mpwd;
      await adminUpdateMember(memberId, data);
      alert("회원 정보가 수정되었습니다."); navigate(`/admin/members/${memberId}`);
    } catch (error) { alert(error.response?.data?.message || "수정 중 오류가 발생했습니다."); } finally { setSaving(false); }
  };

  if (fetching) return <AdminLayout><div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen"><div className="py-24 text-center text-gray-400">데이터를 불러오는 중입니다...</div></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="mb-4 text-sm text-gray-400">회원 관리 &gt; 일반회원 &gt; <span className="text-gray-600 font-semibold">회원 수정</span></div>
        <div className="space-y-5">
          <div className="flex justify-between items-end">
            <div>
              <button onClick={() => navigate(`/admin/members/${memberId}`)} className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-1 flex items-center gap-1"><span>←</span> 돌아가기</button>
              <h2 className="text-2xl font-bold text-gray-900">회원 수정</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate(`/admin/members/${memberId}`)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">취소</button>
              <button onClick={handleSubmit} disabled={saving} className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">{saving ? '저장 중...' : '저장'}</button>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 space-y-5">
              <div><Label text="아이디 (변경불가)" /><input value={loginId} disabled className="w-full max-w-md px-4 py-2.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-500" /></div>
              <div className="grid grid-cols-2 gap-6">
                <div><Label text="이름" required /><input name="mname" value={form.mname} onChange={handleChange} type="text" className={cls('mname')} />{errMsg('mname') && <p className="text-xs text-red-500 mt-1.5">{errMsg('mname')}</p>}</div>
                <div><Label text="연락처" required /><input name="tel" value={form.tel} onChange={handleChange} type="text" placeholder="010-0000-0000" maxLength={13} className={cls('tel')} />{errMsg('tel') && <p className="text-xs text-red-500 mt-1.5">{errMsg('tel')}</p>}</div>
              </div>
              <div><Label text="성별" /><select name="gender" value={form.gender} onChange={handleChange} className={`${ic} max-w-xs bg-white border-gray-200 focus:border-blue-300 focus:ring-blue-100`}><option value={0}>미지정</option><option value={1}>남성</option><option value={2}>여성</option></select></div>
              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs text-gray-400 mb-3">비밀번호 변경 (변경하지 않으려면 비워두세요)</p>
                <div className="grid grid-cols-2 gap-6">
                  <div><Label text="새 비밀번호" /><input name="mpwd" value={form.mpwd} onChange={handleChange} type="password" placeholder="8~20자, 영문+숫자 또는 특수문자 포함" className={cls('mpwd')} />{errMsg('mpwd') && <p className="text-xs text-red-500 mt-1.5">{errMsg('mpwd')}</p>}</div>
                  <div><Label text="새 비밀번호 확인" /><input name="mpwdConfirm" value={form.mpwdConfirm} onChange={handleChange} type="password" placeholder="비밀번호 재입력" className={cls('mpwdConfirm')} />{errMsg('mpwdConfirm') && <p className="text-xs text-red-500 mt-1.5">{errMsg('mpwdConfirm')}</p>}</div>
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
