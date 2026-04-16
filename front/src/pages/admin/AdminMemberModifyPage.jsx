import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { adminGetMember, adminUpdateMember } from '../../api/memberApi';
import { formatTelInput, pwdRegex, PWD_ERROR_MSG } from '../../util/adminFormatUtil';

// 공통 스타일
const inputBase = "w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 transition-all";
const errStyle = "border-red-300 focus:border-red-300 focus:ring-red-100";
const normalStyle = "border-gray-200 focus:border-blue-300 focus:ring-blue-100";
const btnPrimary = "px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors";
const btnSecondary = "px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors";

const Label = ({ text, required }) => (
  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
    {text}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const ErrorMsg = ({ msg }) => {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1.5">{msg}</p>;
};

const AdminMemberModifyPage = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    mname: '', tel: '', gender: 0, mpwd: '', mpwdConfirm: ''
  });
  const [loginId, setLoginId] = useState('');
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 데이터 로드
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
      .catch(() => alert("회원 정보를 불러올 수 없습니다."))
      .finally(() => setFetching(false));
  }, [memberId]);

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
    mname: !form.mname.trim() ? '이름을 입력해주세요.' : '',
    tel: !form.tel.trim() ? '연락처를 입력해주세요.' : '',
    mpwd: form.mpwd && !pwdRegex.test(form.mpwd) ? PWD_ERROR_MSG : '',
    mpwdConfirm: form.mpwd && form.mpwd !== form.mpwdConfirm
      ? '비밀번호가 일치하지 않습니다.' : '',
  };

  const hasErr = (f) => submitted && errs[f];
  const liveErr = (f) => {
    if (f === 'mpwd') return form.mpwd && !pwdRegex.test(form.mpwd);
    if (f === 'mpwdConfirm') return form.mpwdConfirm && form.mpwd !== form.mpwdConfirm;
    return false;
  };
  const cls = (f) => `${inputBase} ${hasErr(f) || liveErr(f) ? errStyle : normalStyle}`;
  const errMsg = (f) => (hasErr(f) || liveErr(f)) ? (errs[f] || '') : '';

  // 저장 핸들러
  const handleSubmit = async () => {
    setSubmitted(true);
    if (errs.mname || errs.tel || errs.mpwd || errs.mpwdConfirm) return;

    setSaving(true);
    try {
      const data = {
        mname: form.mname.trim(),
        tel: form.tel.replace(/-/g, '').trim(),
        gender: form.gender
      };
      if (form.mpwd) data.mpwd = form.mpwd;
      await adminUpdateMember(memberId, data);
      alert("회원 정보가 수정되었습니다.");
      navigate(`/admin/members/${memberId}`);
    } catch (error) {
      alert(error.response?.data?.message || "수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
          <div className="py-24 text-center text-gray-400">데이터를 불러오는 중입니다...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="mb-4 text-sm text-gray-400">
          회원 관리 &gt; 일반회원 &gt;
          <span className="text-gray-600 font-semibold"> 회원 수정</span>
        </div>

        <div className="space-y-5">
          {/* 페이지 헤더 */}
          <div className="flex justify-between items-end">
            <div>
              <button
                onClick={() => navigate(`/admin/members/${memberId}`)}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-1 flex items-center gap-1"
              >
                <span>←</span> 돌아가기
              </button>
              <h2 className="text-2xl font-bold text-gray-900">회원 수정</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate(`/admin/members/${memberId}`)} className={btnSecondary}>
                취소
              </button>
              <button onClick={handleSubmit} disabled={saving} className={btnPrimary}>
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>

          {/* 폼 카드 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 space-y-5">

              {/* 아이디 (변경불가) */}
              <div>
                <Label text="아이디 (변경불가)" />
                <input
                  value={loginId}
                  disabled
                  className="w-full max-w-md px-4 py-2.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-500"
                />
              </div>

              {/* 이름 + 연락처 */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label text="이름" required />
                  <input
                    name="mname"
                    value={form.mname}
                    onChange={handleChange}
                    type="text"
                    className={cls('mname')}
                  />
                  <ErrorMsg msg={errMsg('mname')} />
                </div>
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
              </div>

              {/* 성별 */}
              <div>
                <Label text="성별" />
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={`${inputBase} max-w-xs bg-white ${normalStyle}`}
                >
                  <option value={0}>미지정</option>
                  <option value={1}>남성</option>
                  <option value={2}>여성</option>
                </select>
              </div>

              {/* 비밀번호 변경 */}
              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs text-gray-400 mb-3">
                  비밀번호 변경 (변경하지 않으려면 비워두세요)
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label text="새 비밀번호" />
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
                    <Label text="새 비밀번호 확인" />
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
              </div>

            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMemberModifyPage;
