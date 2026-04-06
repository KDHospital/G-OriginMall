import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { adminGetSellerDetail, adminUpdateSeller, adminApproveSeller, adminRejectSeller, adminDeleteMember } from '../../api/memberApi';

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else if (name === 'businessVerified') {
      setForm({ ...form, businessVerified: value === 'true' });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!form.mname.trim()) return alert("이름을 입력해주세요.");
    if (!form.tel.trim()) return alert("연락처를 입력해주세요.");
    setSaving(true);
    try {
      const data = {
        mname: form.mname.trim(),
        tel: form.tel.trim(),
        businessVerified: form.businessVerified
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
    try { await adminApproveSeller(memberId); alert("승인되었습니다."); loadSeller(); } catch { alert("승인 실패"); }
  };

  const handleReject = async () => {
    if (!window.confirm("거절하시겠습니까? 계정이 삭제됩니다.")) return;
    try { await adminRejectSeller(memberId); alert("거절되었습니다."); navigate('/admin/sellers'); } catch { alert("거절 실패"); }
  };

  const handleDelete = async () => {
    if (!window.confirm("비활성화하시겠습니까?")) return;
    try { await adminDeleteMember(memberId); alert("비활성화되었습니다."); navigate('/admin/sellers'); } catch { alert("삭제 실패"); }
  };

  const formatDateTime = (dt) => dt ? dt.replace('T', ' ').slice(0, 16) : '-';

  if (loading) return <AdminLayout><div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen"><div className="py-24 text-center text-gray-400">데이터를 불러오는 중입니다...</div></div></AdminLayout>;
  if (!seller) return <AdminLayout><div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen"><div className="py-24 text-center text-gray-400">판매회원 정보를 찾을 수 없습니다.</div></div></AdminLayout>;

  const Field = ({ label, children }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</label>
      {children}
    </div>
  );

  const Text = ({ value }) => <p className="text-sm text-gray-800">{value || '-'}</p>;

  const Input = ({ name, value, type = 'text', placeholder = '' }) => (
    <input name={name} value={value} onChange={handleChange} type={type} placeholder={placeholder}
      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all" />
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
                  <button onClick={() => { setEditing(false); loadSeller(); }} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">취소</button>
                  <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">{saving ? '저장 중...' : '저장'}</button>
                </>
              ) : (
                <>
                  {!seller.businessVerified && (
                    <>
                      <button onClick={handleReject} className="px-5 py-2.5 text-sm font-semibold text-amber-600 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors">거절</button>
                      <button onClick={handleApprove} className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">승인</button>
                    </>
                  )}
                  <button onClick={handleDelete} className="px-5 py-2.5 text-sm font-semibold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">삭제</button>
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
                    <option value="false">대기</option>
                    <option value="true">승인</option>
                  </select>
                ) : (
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${seller.businessVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {seller.businessVerified ? '승인' : '대기'}
                  </span>
                )}
                <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600">판매회원</span>
                {(editing ? form.isVerified : seller.isVerified) && <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-yellow-50 text-yellow-600">특산물 인증</span>}
              </div>
              {!editing ? (
                <>
                  <h3 className="text-xl font-bold text-gray-900">{seller.mname}</h3>
                  <p className="text-sm text-gray-400 mt-1">{seller.loginId}</p>
                </>
              ) : (
                <div className="space-y-3 mt-2">
                  <Field label="이름"><Input name="mname" value={form.mname} /></Field>
                  <Field label="아이디 (변경불가)"><input value={seller.loginId} disabled className="w-full px-4 py-2.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-500" /></Field>
                </div>
              )}
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                <Field label="이메일">{editing ? <input value={seller.email} disabled className="w-full px-4 py-2.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-500" /> : <Text value={seller.email} />}</Field>
                <Field label="연락처">{editing ? <Input name="tel" value={form.tel} /> : <Text value={seller.tel} />}</Field>
                <Field label="신청일"><Text value={formatDateTime(seller.createdAt)} /></Field>
                {editing && (
                  <Field label="비밀번호 변경 (선택)"><Input name="mpwd" value={form.mpwd} type="password" placeholder="변경 시에만 입력" /></Field>
                )}
              </div>
            </div>
          </div>

          {/* 사업자 정보 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100"><h4 className="font-bold text-gray-800">사업자 정보</h4></div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                <Field label="사업자등록번호"><Text value={seller.businessNo} /></Field>
                <Field label="세금계산서 발행"><Text value={seller.taxInvoice ? '가능' : '불가'} /></Field>
                <Field label="현금영수증 번호"><Text value={seller.cashReceiptNo} /></Field>
                <Field label="특산물 인증"><Text value={seller.isVerified ? '인증됨' : '미인증'} /></Field>
                {seller.description && <div className="col-span-2"><Field label="소개"><Text value={seller.description} /></Field></div>}
              </div>
            </div>
          </div>

          {/* 정산 정보 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100"><h4 className="font-bold text-gray-800">정산 정보</h4></div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-3 gap-x-12 gap-y-5">
                <Field label="예금주"><Text value={seller.settlementName} /></Field>
                <Field label="은행"><Text value={seller.settlementBank} /></Field>
                <Field label="계좌번호"><Text value={seller.bankAccount} /></Field>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSellerDetailPage;
