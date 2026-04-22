import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { adminCreateMember, adminCheckLoginId, adminCheckEmail } from '../../api/memberApi';
import {
  formatTelInput, pwdRegex, emailRegex, PWD_ERROR_MSG,
  INPUT_BASE, INPUT_ERR, INPUT_OK, BTN_PRIMARY, BTN_SECONDARY
} from '../../util/adminFormatUtil';
import { Label, ErrorMsg } from '../../components/admin/AdminFormFields';

const AdminMemberAddPage = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    loginId: '', mname: '', mpwd: '', mpwdConfirm: '',
    tel: '', email: '', gender: 0
  });

  // 중복 확인 상태
  // state: 'idle' | 'checking' | 'available' | 'duplicate'
  // value: 마지막 확인 시점의 값 (입력값 변경 시 상태 리셋용)
  const [idCheck, setIdCheck] = useState({ state: 'idle', value: '', message: '' });
  const [emailCheck, setEmailCheck] = useState({ state: 'idle', value: '', message: '' });

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tel') {
      setForm({ ...form, tel: formatTelInput(value) });
    } else if (name === 'gender') {
      setForm({ ...form, gender: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
      // 값이 변경되면 중복 확인 상태 리셋
      if (name === 'loginId') setIdCheck({ state: 'idle', value: '', message: '' });
      if (name === 'email') setEmailCheck({ state: 'idle', value: '', message: '' });
    }
  };

  // 아이디 중복 확인
  const handleCheckLoginId = async () => {
    const loginId = form.loginId.trim();
    if (!loginId) {
      alert('아이디를 입력해주세요.');
      return;
    }
    setIdCheck({ state: 'checking', value: loginId, message: '' });
    try {
      const res = await adminCheckLoginId(loginId);
      setIdCheck({
        state: res.available ? 'available' : 'duplicate',
        value: loginId,
        message: res.message
      });
    } catch (error) {
      setIdCheck({ state: 'idle', value: '', message: '' });
      alert('중복이 확인되어 다시 입력해주세요.');
    }
  };

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    const email = form.email.trim();
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if (!emailRegex.test(email)) {
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }
    setEmailCheck({ state: 'checking', value: email, message: '' });
    try {
      const res = await adminCheckEmail(email);
      setEmailCheck({
        state: res.available ? 'available' : 'duplicate',
        value: email,
        message: res.message
      });
    } catch (error) {
      setEmailCheck({ state: 'idle', value: '', message: '' });
      alert('중복이 확인되어 다시 입력해주세요.');
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
  const cls = (f) => `${INPUT_BASE} ${hasErr(f) || liveErr(f) ? INPUT_ERR : INPUT_OK}`;
  const errMsg = (f) => (hasErr(f) || liveErr(f)) ? (errs[f] || '') : '';

  // 등록 핸들러
  const handleSubmit = async () => {
    setSubmitted(true);
    if (Object.values(errs).some(e => e)) return;

    // 중복 확인 검증
    if (idCheck.state !== 'available' || idCheck.value !== form.loginId.trim()) {
      alert('아이디 중복 확인을 완료해주세요.');
      return;
    }
    if (emailCheck.state !== 'available' || emailCheck.value !== form.email.trim()) {
      alert('이메일 중복 확인을 완료해주세요.');
      return;
    }

    setSaving(true);
    try {
      await adminCreateMember({
        loginId: form.loginId.trim(),
        mname: form.mname.trim(),
        mpwd: form.mpwd,
        tel: form.tel.replace(/-/g, '').trim(),
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
              <button onClick={() => navigate('/admin/members')} className={BTN_SECONDARY}>
                취소
              </button>
              <button onClick={handleSubmit} disabled={saving} className={BTN_PRIMARY}>
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
                <div className="flex gap-2 max-w-md">
                  <input
                    name="loginId"
                    value={form.loginId}
                    onChange={handleChange}
                    type="text"
                    placeholder="example@email.com"
                    autoComplete="off"
                    className={`${cls('loginId')} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={handleCheckLoginId}
                    disabled={idCheck.state === 'checking'}
                    className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 whitespace-nowrap"
                  >
                    {idCheck.state === 'checking' ? '확인 중...' : '중복 확인'}
                  </button>
                </div>
                <ErrorMsg msg={errMsg('loginId')} />
                {idCheck.state === 'available' && idCheck.value === form.loginId.trim() && (
                  <p className="text-xs text-emerald-600 mt-1.5">✓ {idCheck.message}</p>
                )}
                {idCheck.state === 'duplicate' && idCheck.value === form.loginId.trim() && (
                  <p className="text-xs text-red-500 mt-1.5">✗ {idCheck.message}</p>
                )}
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
                  <div className="flex gap-2">
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="example@email.com"
                      autoComplete="off"
                      className={`${cls('email')} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={handleCheckEmail}
                      disabled={emailCheck.state === 'checking'}
                      className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 whitespace-nowrap"
                    >
                      {emailCheck.state === 'checking' ? '확인 중...' : '중복 확인'}
                    </button>
                  </div>
                  <ErrorMsg msg={errMsg('email')} />
                  {emailCheck.state === 'available' && emailCheck.value === form.email.trim() && (
                    <p className="text-xs text-emerald-600 mt-1.5">✓ {emailCheck.message}</p>
                  )}
                  {emailCheck.state === 'duplicate' && emailCheck.value === form.email.trim() && (
                    <p className="text-xs text-red-500 mt-1.5">✗ {emailCheck.message}</p>
                  )}
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
                    autoComplete="new-password"
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
                    autoComplete="new-password"
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
                    className={`${INPUT_BASE} bg-white ${INPUT_OK}`}
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
