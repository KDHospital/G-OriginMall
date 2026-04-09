import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { adminCreateMember } from '../../api/memberApi';
import { formatTelInput, pwdRegex, emailRegex, PWD_ERROR_MSG } from '../../util/adminFormatUtil';

// 공통 스타일
const inputBase = "w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 transition-all";
const errStyle = "border-red-300 focus:border-red-300 focus:ring-red-100";
const normalStyle = "border-gray-200 focus:border-blue-300 focus:ring-blue-100";
const btnPrimary = "px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors";
const btnSecondary = "px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors";

// 라벨 컴포넌트
const Label = ({ text, required }) => (
  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
    {text}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

// 에러 메시지 컴포넌트
const ErrorMsg = ({ msg }) => {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1.5">{msg}</p>;
};

const AdminMemberAddPage = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    loginId: '', mname: '', mpwd: '', mpwdConfirm: '',
    tel: '', email: '', gender: 0
  });

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tel') {
      setForm({ ...form, tel: formatTelInput(value) });
    } else if (name === 'gender') {
      setForm({ ...form, gender: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 유효성 검증
  const errs = {
    loginId: !form.loginId.trim() ? '아이디를 입력해주세요.' : '',
    mname: !form.mname.trim() ? '이름을 입력해주세요.' : '',
    email: !form.email.trim()
      ? '이메일을 입력해주세요.'
      : (!emailRegex.test(form.email) ? '올바른 이메일 형식이 아닙니다.' : ''),
    mpwd: !form.mpwd
      ? '비밀번호를 입력해주세요.'
      : (!pwdRegex.test(form.mpwd) ? PWD_ERROR_MSG : ''),
    mpwdConfirm: !form.mpwdConfirm
      ? '비밀번호 확인을 입력해주세요.'
      : (form.mpwd !== form.mpwdConfirm ? '비밀번호가 일치하지 않습니다.' : ''),
    tel: !form.tel.trim() ? '연락처를 입력해주세요.' : '',
  };

  // 에러 판단 헬퍼
  const hasErr = (f) => submitted && errs[f];
  const liveErr = (f) => {
    if (f === 'mpwd') return form.mpwd && !pwdRegex.test(form.mpwd);
    if (f === 'mpwdConfirm') return form.mpwdConfirm && form.mpwd !== form.mpwdConfirm;
    return false;
  };
  const cls = (f) => `${inputBase} ${hasErr(f) || liveErr(f) ? errStyle : normalStyle}`;
  const errMsg = (f) => (hasErr(f) || liveErr(f)) ? (errs[f] || '') : '';

  // 등록 핸들러
  const handleSubmit = async () => {
    setSubmitted(true);
    if (Object.values(errs).some(e => e)) return;

    setSaving(true);
    try {
      await adminCreateMember({
        loginId: form.loginId.trim(),
        mname: form.mname.trim(),
        mpwd: form.mpwd,
        tel: form.tel.trim(),
        email: form.email.trim(),
        gender: form.gender
      });
      alert("회원이 등록되었습니다.");
      navigate('/admin/members');
    } catch (error) {
      alert(error.response?.data?.message || "등록 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="mb-4 text-sm text-gray-400">
          회원 관리 &gt; 일반회원 &gt;
          <span className="text-gray-600 font-semibold"> 회원 등록</span>
        </div>

        <div className="space-y-5">
          {/* 페이지 헤더 */}
          <div className="flex justify-between items-end">
            <div>
              <button
                onClick={() => navigate('/admin/members')}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-1 flex items-center gap-1"
              >
                <span>←</span> 목록으로
              </button>
              <h2 className="text-2xl font-bold text-gray-900">회원 등록</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/admin/members')} className={btnSecondary}>
                취소
              </button>
              <button onClick={handleSubmit} disabled={saving} className={btnPrimary}>
                {saving ? '등록 중...' : '등록'}
              </button>
            </div>
          </div>

          {/* 폼 카드 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 space-y-5">

              {/* 아이디 */}
              <div>
                <Label text="아이디 (로그인 ID)" required />
                <input
                  name="loginId"
                  value={form.loginId}
                  onChange={handleChange}
                  type="text"
                  placeholder="example@email.com"
                  className={`${cls('loginId')} max-w-md`}
                />
                <ErrorMsg msg={errMsg('loginId')} />
              </div>

              {/* 이름 + 이메일 */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label text="이름" required />
                  <input
                    name="mname"
                    value={form.mname}
                    onChange={handleChange}
                    type="text"
                    placeholder="홍길동"
                    className={cls('mname')}
                  />
                  <ErrorMsg msg={errMsg('mname')} />
                </div>
                <div>
                  <Label text="이메일" required />
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="example@email.com"
                    className={cls('email')}
                  />
                  <ErrorMsg msg={errMsg('email')} />
                </div>
              </div>

              {/* 비밀번호 */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label text="비밀번호" required />
                  <input
                    name="mpwd"
                    value={form.mpwd}
                    onChange={handleChange}
                    type="password"
                    placeholder="8~20자, 영문+숫자 또는 특수문자 포함"
                    className={cls('mpwd')}
                  />
                  <ErrorMsg msg={errMsg('mpwd')} />
                </div>
                <div>
                  <Label text="비밀번호 확인" required />
                  <input
                    name="mpwdConfirm"
                    value={form.mpwdConfirm}
                    onChange={handleChange}
                    type="password"
                    placeholder="비밀번호 재입력"
                    className={cls('mpwdConfirm')}
                  />
                  <ErrorMsg msg={errMsg('mpwdConfirm')} />
                </div>
              </div>

              {/* 연락처 + 성별 */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label text="연락처" required />
                  <input
                    name="tel"
                    value={form.tel}
                    onChange={handleChange}
                    type="text"
                    placeholder="010-0000-0000"
                    maxLength={13}
                    className={cls('tel')}
                  />
                  <ErrorMsg msg={errMsg('tel')} />
                </div>
                <div>
                  <Label text="성별" />
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className={`${inputBase} bg-white ${normalStyle}`}
                  >
                    <option value={0}>미지정</option>
                    <option value={1}>남성</option>
                    <option value={2}>여성</option>
                  </select>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMemberAddPage;
