import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { adminGetSellerDetail, adminUpdateSeller, adminApproveSeller, adminRejectSeller, adminDeleteMember } from '../../api/memberApi';

const DetailField = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</label>
    {children}
  </div>
);

const DetailText = ({ value }) => <p className="text-sm text-gray-800">{value || '-'}</p>;
import { fmtBizNo, fmtTel, fmtDateTime } from '../../util/adminFormatUtil';

const AdminSellerDetailPage = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  const loadSeller = () => {
    if (!memberId) return;
    setLoading(true);
    adminGetSellerDetail(memberId)
      .then(data => {
        setSeller(data);
        setForm({
          mname: data.mname || '',
          tel: data.tel || '',
          businessVerified: data.businessVerified || false,
          businessNo: data.businessNo || '',
          taxInvoice: data.taxInvoice || false,
          cashReceiptNo: data.cashReceiptNo || '',
          isVerified: data.isVerified || false,
          settlementName: data.settlementName || '',
          settlementBank: data.settlementBank || '',
          bankAccount: data.bankAccount || '',
          description: data.description || '',
          mpwd: ''
        });
      })
      .catch(err => console.error("판매회원 상세 조회 실패:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadSeller(); }, [memberId]);

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
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else if (name === 'businessVerified') {
      setForm({ ...form, businessVerified: value === 'true' });
    } else if (name === 'tel') {
      setForm({ ...form, tel: formatTel(value) });
    } else if (name === 'businessNo') {
      setForm({ ...form, businessNo: formatBizNo(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const [editSubmitted, setEditSubmitted] = useState(false);
  const pwdRegex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*]).{8,20}$/;
  const editErrs = {
    mname: !form.mname?.trim() ? '이름을 입력해주세요.' : '',
    tel: !form.tel?.trim() ? '연락처를 입력해주세요.' : '',
    mpwd: form.mpwd && !pwdRegex.test(form.mpwd)
      ? '8~20자, 영문과 숫자 또는 특수문자(!@#$%^&*)를 포함해야 합니다.' : '',
    settlementName: !form.settlementName?.trim() ? '예금주를 입력해주세요.' : '',
    settlementBank: !form.settlementBank?.trim() ? '은행을 입력해주세요.' : '',
    bankAccount: !form.bankAccount?.trim() ? '계좌번호를 입력해주세요.' : '',
  };
  const editHasErr = (f) => editSubmitted && editErrs[f];
  const editLiveErr = (f) => f === 'mpwd' && form.mpwd && !pwdRegex.test(form.mpwd);
  const editCls = (f) => {
    const isErr = editHasErr(f) || editLiveErr(f);
    const state = isErr
      ? 'border-red-300 focus:border-red-300 focus:ring-red-100'
      : 'border-gray-200 focus:border-blue-300 focus:ring-blue-100';
    return `w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 transition-all ${state}`;
  };
  const editErrMsg = (f) => (editHasErr(f) || editLiveErr(f)) ? (editErrs[f] || '') : '';

  const handleSave = async () => {
    setEditSubmitted(true);
    if (editErrs.mname || editErrs.tel || editErrs.mpwd || editErrs.settlementName || editErrs.settlementBank || editErrs.bankAccount) return;
    setSaving(true);
    try {
      const data = {
        mname: form.mname.trim(),
        tel: form.tel.trim(),
        businessVerified: form.businessVerified,
        businessNo: form.businessNo?.replace(/-/g, '').trim() || '',
        isVerified: form.isVerified || false,
        taxInvoice: form.taxInvoice || false,
        cashReceiptNo: form.cashReceiptNo?.trim() || '',
        description: form.description?.trim() || '',
        settlementName: form.settlementName?.trim() || '',
        settlementBank: form.settlementBank?.trim() || '',
        bankAccount: form.bankAccount?.trim() || ''
      };
      if (form.mpwd) data.mpwd = form.mpwd;
      await adminUpdateSeller(memberId, data);
      alert("판매회원 정보가 수정되었습니다.");
      setEditing(false);
      loadSeller();
    } catch (error) {
      alert(error.response?.data?.message || "수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm("승인하시겠습니까?")) return;
    try {
      await adminApproveSeller(memberId);
      alert("승인되었습니다.");
      loadSeller();
    } catch {
      alert("승인 실패");
    }
  };

  const handleReject = async () => {
    if (!window.confirm("미승인 처리하시겠습니까?")) return;
    try {
      await adminRejectSeller(memberId);
      alert("미승인되었습니다.");
      navigate('/admin/sellers');
    } catch {
      alert("미승인 실패");
    }
  };

  const handleDelete = async () => {
    if (seller.isDeleted) return alert("이미 탈퇴한 회원입니다.");
    if (!window.confirm("해당 판매자를 탈퇴 처리 할까요?")) return;
    try {
      await adminDeleteMember(memberId);
      alert("탈퇴 처리되었습니다.");
      navigate('/admin/sellers');
    } catch {
      alert("탈퇴 처리에 실패했습니다.");
    }
  };


  if (loading) return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="py-24 text-center text-gray-400">데이터를 불러오는 중입니다...</div>
      </div>
    </AdminLayout>
  );

  if (!seller) return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="py-24 text-center text-gray-400">판매회원 정보를 찾을 수 없습니다.</div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="mb-4 text-sm text-gray-400">회원 관리 &gt; 판매회원 &gt; <span className="text-gray-600 font-semibold">판매회원 상세</span></div>

        <div className="space-y-5">
          <div className="flex justify-between items-end">
            <div>
              <button onClick={() => navigate('/admin/sellers')} className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-1 flex items-center gap-1"><span>←</span> 목록으로</button>
              <h2 className="text-2xl font-bold text-gray-900">판매회원 {editing ? '수정' : '상세'}</h2>
            </div>
            <div className="flex gap-2">
              {editing ? (
                <>
                  <button onClick={() => { if (!window.confirm("변경사항이 저장되지 않습니다. 취소하시겠습니까?")) return; setEditing(false); setEditSubmitted(false); loadSeller(); }} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">취소</button>
                  <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">{saving ? '저장 중...' : '저장'}</button>
                </>
              ) : (
                <>
                  <button onClick={handleDelete} className="px-5 py-2.5 text-sm font-semibold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">탈퇴</button>
                  <button onClick={() => setEditing(true)} className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">수정</button>
                </>
              )}
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                {editing ? (
                  <select name="businessVerified" value={String(form.businessVerified)} onChange={handleChange}
                    className="px-3 py-1.5 border border-blue-300 rounded-lg text-[11px] font-semibold outline-none bg-white focus:ring-2 focus:ring-blue-100">
                    <option value="false">미승인</option>
                    <option value="true">승인</option>
                  </select>
                ) : (
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${seller.businessVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {seller.businessVerified ? '승인' : '미승인'}
                  </span>
                )}
                <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600">판매회원</span>
                {(editing ? form.isVerified : seller.isVerified) && <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-yellow-50 text-yellow-600">특산물 인증</span>}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{seller.mname}</h3>
              <p className="text-sm text-gray-400 mt-1">회원ID : {seller.id}</p>
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                <DetailField label="아이디">{editing ? <input value={seller.loginId} disabled className="w-full px-4 py-2.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-500" /> : <DetailText value={seller.loginId} />}</DetailField>
                <DetailField label="이름">{editing ? <><input name="mname" value={form.mname} onChange={handleChange} type="text" className={editCls('mname')} />{editErrMsg('mname') && <p className="text-xs text-red-500 mt-1.5">{editErrMsg('mname')}</p>}</> : <DetailText value={seller.mname} />}</DetailField>
                <DetailField label="이메일">{editing ? <input value={seller.email} disabled className="w-full px-4 py-2.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-500" /> : <DetailText value={seller.email} />}</DetailField>
                <DetailField label="연락처">{editing ? <><input name="tel" value={form.tel} onChange={handleChange} type="text" className={editCls('tel')} />{editErrMsg('tel') && <p className="text-xs text-red-500 mt-1.5">{editErrMsg('tel')}</p>}</> : <DetailText value={fmtTel(seller.tel)} />}</DetailField>
                <DetailField label="가입일"><DetailText value={fmtDateTime(seller.createdAt)} /></DetailField>
                <DetailField label="최근 수정일"><DetailText value={fmtDateTime(seller.updatedAt)} /></DetailField>
                {seller.isDeleted && <DetailField label="탈퇴일"><p className="text-sm text-red-500 font-medium">{fmtDateTime(seller.withdrawAt)}</p></DetailField>}
                {editing && (
                  <DetailField label="비밀번호 변경 (선택)"><input name="mpwd" value={form.mpwd} onChange={handleChange} type="password" placeholder="변경 시에만 입력" className={editCls('mpwd')} />{editErrMsg('mpwd') && <p className="text-xs text-red-500 mt-1.5">{editErrMsg('mpwd')}</p>}</DetailField>
                )}
              </div>
            </div>
          </div>

          {/* 판매 현황 */}
          {!editing && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">등록 상품 수</p>
                <p className="text-2xl font-bold text-gray-900">{seller.productCount ?? 0}<span className="text-sm font-normal text-gray-400 ml-1">건</span></p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 px-6 py-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">총 주문 건수</p>
                <p className="text-2xl font-bold text-gray-900">{seller.orderCount ?? 0}<span className="text-sm font-normal text-gray-400 ml-1">건</span></p>
              </div>
            </div>
          )}

          {/* 사업자 정보 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <h4 className="font-bold text-gray-800">사업자 정보</h4>
              {editing && <span className="text-xs text-gray-400">사업자 등록증이 없는 판매자는 생략 가능, 필요한 내용만 선택해서 처리해주세요.</span>}
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                <DetailField label="사업자등록번호">{editing ? <input name="businessNo" value={form.businessNo} onChange={handleChange} type="text" placeholder="000-00-00000" maxLength={12} className={editCls('_')} /> : <DetailText value={fmtBizNo(seller.businessNo)} />}</DetailField>
                <DetailField label="세금계산서 발행">{editing ? <label className="flex items-center gap-2 cursor-pointer mt-1"><input name="taxInvoice" type="checkbox" checked={form.taxInvoice} onChange={handleChange} className="w-4 h-4 accent-blue-600" /><span className="text-sm text-gray-700">발행 가능</span></label> : <DetailText value={seller.taxInvoice ? '가능' : '불가'} />}</DetailField>
                <DetailField label="현금영수증 번호">{editing ? <input name="cashReceiptNo" value={form.cashReceiptNo} onChange={handleChange} type="text" placeholder="선택 입력" className={editCls('_')} /> : <DetailText value={seller.cashReceiptNo} />}</DetailField>
                <DetailField label="특산물 인증">{editing ? <label className="flex items-center gap-2 cursor-pointer mt-1"><input name="isVerified" type="checkbox" checked={form.isVerified} onChange={handleChange} className="w-4 h-4 accent-blue-600" /><span className="text-sm text-gray-700">인증됨</span></label> : <DetailText value={seller.isVerified ? '인증됨' : '미인증'} />}</DetailField>
                <div className="col-span-2"><DetailField label="소개">{editing ? <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="판매자 소개 (선택)" className={editCls('_') + ' resize-y'} /> : <DetailText value={seller.description} />}</DetailField></div>
              </div>
            </div>
          </div>

          {/* 정산 정보 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100"><h4 className="font-bold text-gray-800">정산 정보</h4></div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-3 gap-x-12 gap-y-5">
                <DetailField label="예금주">{editing ? <><input name="settlementName" value={form.settlementName} onChange={handleChange} type="text" placeholder="예금주명" className={editCls('settlementName')} />{editErrMsg('settlementName') && <p className="text-xs text-red-500 mt-1.5">{editErrMsg('settlementName')}</p>}</> : <DetailText value={seller.settlementName} />}</DetailField>
                <DetailField label="은행">{editing ? <><input name="settlementBank" value={form.settlementBank} onChange={handleChange} type="text" placeholder="은행명" className={editCls('settlementBank')} />{editErrMsg('settlementBank') && <p className="text-xs text-red-500 mt-1.5">{editErrMsg('settlementBank')}</p>}</> : <DetailText value={seller.settlementBank} />}</DetailField>
                <DetailField label="계좌번호">{editing ? <><input name="bankAccount" value={form.bankAccount} onChange={handleChange} type="text" placeholder="계좌번호" className={editCls('bankAccount')} />{editErrMsg('bankAccount') && <p className="text-xs text-red-500 mt-1.5">{editErrMsg('bankAccount')}</p>}</> : <DetailText value={seller.bankAccount} />}</DetailField>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSellerDetailPage;
