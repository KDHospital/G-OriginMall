import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { adminCreateSeller } from '../../api/memberApi';

const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all";

const Field = ({ label, children, span2, required }) => (
  <div className={span2 ? 'col-span-2' : ''}>
    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const AdminSellerAddPage = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    loginId: '', mname: '', mpwd: '', mpwdConfirm: '', tel: '', email: '',
    gender: 0, businessNo: '', taxInvoice: false, cashReceiptNo: '',
    settlementName: '', settlementBank: '', bankAccount: '', isVerified: false, description: ''
  });

  // 입력 포맷
  const formatTel = (v) => {
    const n = v.replace(/[^0-9]/g, '').slice(0, 11);
    if (n.length <= 3) return n;
    if (n.length <= 7) return `${n.slice(0, 3)}-${n.slice(3)}`;
    return `${n.slice(0, 3)}-${n.slice(3, 7)}-${n.slice(7)}`;
  };

  const formatBizNo = (v) => {
    const n = v.replace(/[^0-9]/g, '').slice(0, 10);
    if (n.length <= 3) return n;
    if (n.length <= 5) return `${n.slice(0, 3)}-${n.slice(3)}`;
    return `${n.slice(0, 3)}-${n.slice(3, 5)}-${n.slice(5)}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') setForm({ ...form, [name]: checked });
    else if (name === 'tel') setForm({ ...form, tel: formatTel(value) });
    else if (name === 'businessNo') setForm({ ...form, businessNo: formatBizNo(value) });
    else if (name === 'gender') setForm({ ...form, gender: Number(value) });
    else setForm({ ...form, [name]: value });
  };

  const pwdRegex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*]).{8,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const errors = {
    loginId: !form.loginId.trim() ? '아이디를 입력해주세요.' : '',
    mname: !form.mname.trim() ? '담당자명을 입력해주세요.' : '',
    email: !form.email.trim() ? '이메일을 입력해주세요.' : (!emailRegex.test(form.email) ? '올바른 이메일 형식이 아닙니다.' : ''),
    mpwd: !form.mpwd ? '비밀번호를 입력해주세요.' : (!pwdRegex.test(form.mpwd) ? '8~20자, 영문과 숫자 또는 특수문자(!@#$%^&*)를 포함해야 합니다.' : ''),
    mpwdConfirm: !form.mpwdConfirm ? '비밀번호 확인을 입력해주세요.' : (form.mpwd !== form.mpwdConfirm ? '비밀번호가 일치하지 않습니다.' : ''),
    tel: !form.tel.trim() ? '연락처를 입력해주세요.' : '',
    settlementName: !form.settlementName.trim() ? '예금주를 입력해주세요.' : '',
    settlementBank: !form.settlementBank.trim() ? '은행을 입력해주세요.' : '',
    bankAccount: !form.bankAccount.trim() ? '계좌번호를 입력해주세요.' : '',
  };

  const hasError = (field) => submitted && errors[field];
  const errorClass = (field) => hasError(field) ? ' border-red-300' : '';

  const handleSubmit = async () => {
    setSubmitted(true);
    const hasAnyError = Object.values(errors).some(e => e);
    if (hasAnyError) return;

    setSaving(true);
    try {
      await adminCreateSeller({
        loginId: form.loginId.trim(), mname: form.mname.trim(), mpwd: form.mpwd,
        tel: form.tel.replace(/-/g, ''), email: form.email.trim(), gender: form.gender,
        businessNo: form.businessNo.replace(/-/g, '').trim(), taxInvoice: form.taxInvoice,
        cashReceiptNo: form.cashReceiptNo.replace(/-/g, '').trim(), settlementName: form.settlementName.trim(),
        settlementBank: form.settlementBank.trim(), bankAccount: form.bankAccount.replace(/-/g, '').trim(),
        isVerified: form.isVerified, description: form.description.trim()
      });
      alert("판매회원이 등록되었습니다.");
      navigate('/admin/sellers');
    } catch (error) {
      alert(error.response?.data?.message || "등록 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="mb-4 text-sm text-gray-400">회원 관리 &gt; 판매회원 &gt; <span className="text-gray-600 font-semibold">판매회원 등록</span></div>
        <div className="space-y-5">
          <div className="flex justify-between items-end">
            <div>
              <button onClick={() => navigate('/admin/sellers')} className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-1 flex items-center gap-1"><span>←</span> 목록으로</button>
              <h2 className="text-2xl font-bold text-gray-900">판매회원 등록</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/admin/sellers')} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">취소</button>
              <button onClick={handleSubmit} disabled={saving} className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">{saving ? '등록 중...' : '등록'}</button>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" autoComplete="off">
            <div className="px-6 py-4 border-b border-gray-100"><h4 className="font-bold text-gray-800">기본 정보</h4></div>
            <div className="p-6 grid grid-cols-2 gap-6" autoComplete="off">
              <Field label="아이디 (로그인 ID)" span2 required>
                <input name="loginId" value={form.loginId} onChange={handleChange} type="text" placeholder="example@email.com" autoComplete="off" className={`${inputClass} max-w-md${errorClass('loginId')}`} />
                {hasError('loginId') && <p className="text-xs text-red-500 mt-1.5">{errors.loginId}</p>}
              </Field>
              <Field label="담당자명" required>
                <input name="mname" value={form.mname} onChange={handleChange} type="text" placeholder="담당자명" className={`${inputClass}${errorClass('mname')}`} />
                {hasError('mname') && <p className="text-xs text-red-500 mt-1.5">{errors.mname}</p>}
              </Field>
              <Field label="이메일" required>
                <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="example@email.com" autoComplete="off" className={`${inputClass}${errorClass('email')}`} />
                {hasError('email') && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
              </Field>
              <Field label="비밀번호" required>
                <input name="mpwd" value={form.mpwd} onChange={handleChange} type="password" placeholder="8~20자, 영문+숫자 또는 특수문자" autoComplete="new-password"
                  className={`${inputClass}${errorClass('mpwd') || (form.mpwd && !pwdRegex.test(form.mpwd) ? ' border-red-300' : '')}`} />
                {(hasError('mpwd') || (form.mpwd && !pwdRegex.test(form.mpwd))) && <p className="text-xs text-red-500 mt-1.5">{errors.mpwd || '8~20자, 영문과 숫자 또는 특수문자(!@#$%^&*)를 포함해야 합니다.'}</p>}
              </Field>
              <Field label="비밀번호 확인" required>
                <input name="mpwdConfirm" value={form.mpwdConfirm} onChange={handleChange} type="password" placeholder="비밀번호 재입력" autoComplete="new-password"
                  className={`${inputClass}${errorClass('mpwdConfirm') || (form.mpwdConfirm && form.mpwd !== form.mpwdConfirm ? ' border-red-300' : '')}`} />
                {(hasError('mpwdConfirm') || (form.mpwdConfirm && form.mpwd !== form.mpwdConfirm)) && <p className="text-xs text-red-500 mt-1.5">{errors.mpwdConfirm || '비밀번호가 일치하지 않습니다.'}</p>}
              </Field>
              <Field label="연락처" required>
                <input name="tel" value={form.tel} onChange={handleChange} type="text" placeholder="010-0000-0000" maxLength={13} className={`${inputClass}${errorClass('tel')}`} />
                {hasError('tel') && <p className="text-xs text-red-500 mt-1.5">{errors.tel}</p>}
              </Field>
              <Field label="성별">
                <select name="gender" value={form.gender} onChange={handleChange} className={inputClass + " bg-white"}>
                  <option value={0}>미지정</option><option value={1}>남성</option><option value={2}>여성</option>
                </select>
              </Field>
            </div>
          </div>

          {/* 사업자 정보 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <h4 className="font-bold text-gray-800">사업자 정보</h4>
              <span className="text-xs text-gray-400">사업자 등록증이 없는 판매자는 생략 가능, 필요한 내용만 선택해서 처리해주세요.</span>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6">
              <Field label="사업자등록번호"><input name="businessNo" value={form.businessNo} onChange={handleChange} type="text" placeholder="000-00-00000" maxLength={12} className={inputClass} /></Field>
              <Field label="세금계산서 발급 여부">
                <label className="flex items-center gap-2 cursor-pointer"><input name="taxInvoice" type="checkbox" checked={form.taxInvoice} onChange={handleChange} className="w-4 h-4 accent-blue-600" /><span className="text-sm text-gray-700">발행 가능</span></label>
              </Field>
              <Field label="현금영수증 번호"><input name="cashReceiptNo" value={form.cashReceiptNo} onChange={handleChange} type="text" placeholder="선택 입력" className={inputClass} /></Field>
              <Field label="금빛나루 인증">
                <label className="flex items-center gap-2 cursor-pointer"><input name="isVerified" type="checkbox" checked={form.isVerified} onChange={handleChange} className="w-4 h-4 accent-blue-600" /><span className="text-sm text-gray-700">인증됨</span></label>
              </Field>
              <Field label="상호명" span2><textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="상호명 (선택)" className={inputClass + " resize-y"} /></Field>
            </div>
          </div>

          {/* 정산 정보 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100"><h4 className="font-bold text-gray-800">정산 정보</h4></div>
            <div className="p-6 grid grid-cols-3 gap-6">
              <Field label="예금주" required>
                <input name="settlementName" value={form.settlementName} onChange={handleChange} type="text" placeholder="예금주명" className={`${inputClass}${errorClass('settlementName')}`} />
                {hasError('settlementName') && <p className="text-xs text-red-500 mt-1.5">{errors.settlementName}</p>}
              </Field>
              <Field label="은행" required>
                <input name="settlementBank" value={form.settlementBank} onChange={handleChange} type="text" placeholder="은행명" className={`${inputClass}${errorClass('settlementBank')}`} />
                {hasError('settlementBank') && <p className="text-xs text-red-500 mt-1.5">{errors.settlementBank}</p>}
              </Field>
              <Field label="계좌번호" required>
                <input name="bankAccount" value={form.bankAccount} onChange={handleChange} type="text" placeholder="계좌번호" className={`${inputClass}${errorClass('bankAccount')}`} />
                {hasError('bankAccount') && <p className="text-xs text-red-500 mt-1.5">{errors.bankAccount}</p>}
              </Field>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSellerAddPage;
