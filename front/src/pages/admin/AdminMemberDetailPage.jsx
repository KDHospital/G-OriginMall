import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { adminGetMember, adminGetMemberOrders, adminDeleteMember } from '../../api/memberApi';
import { fmtGender, fmtDateTime } from '../../util/adminFormatUtil';

const AdminMemberDetailPage = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);

  // 주문 목록
  const [orders, setOrders] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderPage, setOrderPage] = useState(1);
  const [orderLoading, setOrderLoading] = useState(false);
  const orderSize = 5;

  useEffect(() => {
    if (!memberId) return;
    setLoading(true);
    adminGetMember(memberId)
      .then(data => setMember(data))
      .catch(err => console.error("회원 상세 조회 실패:", err))
      .finally(() => setLoading(false));
  }, [memberId]);

  useEffect(() => {
    if (!memberId) return;
    setOrderLoading(true);
    adminGetMemberOrders(memberId, orderPage - 1, orderSize)
      .then(data => {
        setOrders(data.dtoList || []);
        setOrderTotal(data.totalCount || 0);
      })
      .catch(err => console.error("주문 목록 조회 실패:", err))
      .finally(() => setOrderLoading(false));
  }, [memberId, orderPage]);


  const formatPrice = (price) => {
    if (!price) return '0';
    return price.toLocaleString();
  };

  const statusLabel = (status) => {
    const labels = { 0: '결제전', 1: '상품준비중', 2: '배송중', 3: '배송완료', 4: '취소/환불', 5: '결제실패' };
    return labels[status] || '알수없음';
  };

  const statusStyle = (status) => {
    const styles = {
      0: 'bg-gray-100 text-gray-500',
      1: 'bg-blue-50 text-blue-600',
      2: 'bg-amber-50 text-amber-600',
      3: 'bg-emerald-50 text-emerald-600',
      4: 'bg-red-50 text-red-500',
      5: 'bg-orange-100 text-orange-500' 
    };
    return styles[status] || 'bg-gray-100 text-gray-500';
  };

  const totalPages = Math.ceil(orderTotal / orderSize);

  if (loading) return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="py-24 text-center text-gray-400">데이터를 불러오는 중입니다...</div>
      </div>
    </AdminLayout>
  );

  if (!member) return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="py-24 text-center text-gray-400">회원 정보를 찾을 수 없습니다.</div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="flex-1 p-8 bg-[#f8f9fa] min-h-screen">
        <div className="mb-4 text-sm text-gray-400">회원 관리 &gt; <span className="text-gray-600 font-semibold">회원 상세</span></div>

        <div className="space-y-5">
          {/* 페이지 헤더 */}
          <div className="flex justify-between items-end">
            <div>
              <button onClick={() => navigate('/admin/members')} className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-1 flex items-center gap-1">
                <span>←</span> 목록으로
              </button>
              <h2 className="text-2xl font-bold text-gray-900">회원 상세</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  if (member.isDeleted) return alert("이미 탈퇴한 회원입니다.");
                  if (!window.confirm("해당 회원을 탈퇴 처리 할까요?")) return;
                  try {
                    await adminDeleteMember(memberId);
                    alert("탈퇴 처리되었습니다.");
                    navigate('/admin/members');
                  } catch {
                    alert("탈퇴 처리에 실패했습니다.");
                  }
                }}
                className="px-5 py-2.5 text-sm font-semibold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                탈퇴
              </button>
              <button
                onClick={() => navigate(`/admin/members/${memberId}/modify`)}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                수정
              </button>
            </div>
          </div>

          {/* 회원 정보 카드 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                  member.isDeleted ? 'bg-gray-100 text-gray-500' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {member.isDeleted ? '탈퇴' : '활성'}
                </span>
                <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600">
                  일반회원
                </span>
                {member.emailVerified && (
                  <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-600">
                    인증 완료
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{member.mname}</h3>
              <p className="text-sm text-gray-400 mt-1">회원ID : {member.id}</p>
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">아이디</label>
                  <p className="text-sm text-gray-800">{member.loginId}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">이름</label>
                  <p className="text-sm text-gray-800">{member.mname}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">이메일</label>
                  <p className="text-sm text-gray-800">{member.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">연락처</label>
                  <p className="text-sm text-gray-800">{member.tel}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">성별</label>
                  <p className="text-sm text-gray-800">{fmtGender(member.gender)}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">가입일</label>
                  <p className="text-sm text-gray-800">{fmtDateTime(member.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">최근 수정일</label>
                  <p className="text-sm text-gray-800">{fmtDateTime(member.updatedAt)}</p>
                </div>
                {member.isDeleted && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">탈퇴일</label>
                    <p className="text-sm text-red-500 font-medium">{fmtDateTime(member.withdrawAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 소셜 로그인 관리 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h4 className="font-bold text-gray-800">소셜 로그인 연동</h4>
            </div>
            <div className="px-6 py-5">
              {member.snsList && member.snsList.length > 0 ? (
                <div className="space-y-3">
                  {member.snsList.map((sns, idx) => {
                    const isKakao = sns.provider?.toLowerCase() === 'kakao';
                    const isNaver = sns.provider?.toLowerCase() === 'naver';
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg"
                      >
                        {/* 아이콘 */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          isKakao ? 'bg-yellow-400 text-yellow-900' : isNaver ? 'bg-green-500' : 'bg-gray-400'
                        }`}>
                          {isKakao ? 'K' : isNaver ? 'N' : '?'}
                        </div>
                        {/* 정보 */}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">
                            {isKakao ? '카카오 로그인' : isNaver ? '네이버 로그인' : sns.provider}
                          </p>
                          <p className="text-xs text-gray-400">
                            연동일: {sns.linkedAt ? fmtDateTime(sns.linkedAt) : '-'}
                          </p>
                        </div>
                        {/* 상태 */}
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600">
                          연동됨
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  {/* 카카오 */}
                  <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-lg flex-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-400 text-yellow-900 text-sm font-bold">K</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">카카오 로그인</p>
                      <p className="text-xs text-gray-400">연동되지 않음</p>
                    </div>
                  </div>
                  {/* 네이버 */}
                  <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-lg flex-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500 text-white text-sm font-bold">N</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">네이버 로그인</p>
                      <p className="text-xs text-gray-400">연동되지 않음</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 주문 내역 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h4 className="font-bold text-gray-800">주문 내역 ({orderTotal}건)</h4>
            </div>

            {orderLoading ? (
              <div className="text-center py-12 text-gray-400 text-sm">불러오는 중...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">주문 내역이 없습니다.</div>
            ) : (
              <>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-4 py-3 w-32 text-left font-semibold">주문번호</th>
                      <th className="px-4 py-3 w-40 text-center font-semibold">판매자</th>
                      <th className="px-4 py-3 text-left font-semibold">주문상품</th>
                      <th className="px-4 py-3 w-28 text-right font-semibold">결제금액</th>
                      <th className="px-4 py-3 w-28 text-center font-semibold">상태</th>
                      <th className="px-4 py-3 w-36 text-center font-semibold">주문일시</th>
                      <th className="px-4 py-3 w-20 text-center font-semibold">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.orderId} className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors">
                        {/* 주문번호 */}
                        <td className="px-4 py-4 text-left text-gray-700 font-medium text-xs">
                          ORDER_{order.orderId}
                        </td>
                        {/* 판매자 */}
                        <td className="px-4 py-4 text-center text-gray-500 text-xs">
                          {order.sellerName || '-'}
                        </td>
                        {/* 주문상품 */}
                        <td className="px-4 py-4 text-left text-gray-800">
                          {order.items && order.items.length > 0 ? (
                            <>
                              {order.items[0].productName}
                              {order.items.length > 1 && (
                                <span className="text-gray-400 ml-1">
                                  외 {order.items.length - 1}건
                                </span>
                              )}
                            </>
                          ) : '-'}
                        </td>
                        {/* 결제금액 */}
                        <td className="px-4 py-4 text-right font-medium text-gray-800">
                          {formatPrice(order.totalPrice)}원
                        </td>
                        {/* 상태 */}
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyle(order.status)}`}>
                            {statusLabel(order.status)}
                          </span>
                        </td>
                        {/* 주문일시 */}
                        <td className="px-4 py-4 text-center text-gray-400 text-xs">
                          {fmtDateTime(order.createdAt)}
                        </td>
                        {/* 관리 */}
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => window.open(`/admin/orders/${order.orderId}`, '_blank')}
                            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors whitespace-nowrap"
                          >
                            상세
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* 주문 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-1 py-4">
                    <button
                      onClick={() => setOrderPage(p => Math.max(1, p - 1))}
                      disabled={orderPage === 1}
                      className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setOrderPage(p)}
                        className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                          p === orderPage ? 'bg-gray-900 text-white border-gray-900' : 'text-gray-500 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setOrderPage(p => Math.min(totalPages, p + 1))}
                      disabled={orderPage === totalPages}
                      className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMemberDetailPage;
