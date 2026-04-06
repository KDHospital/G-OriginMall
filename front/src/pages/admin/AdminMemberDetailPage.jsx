import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { adminGetMember, adminGetMemberOrders, adminDeleteMember } from '../../api/memberApi';

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

  const formatGender = (gender) => {
    if (gender === 1) return '남성';
    if (gender === 2) return '여성';
    return '미지정';
  };

  const formatDateTime = (dt) => {
    if (!dt) return '-';
    return dt.replace('T', ' ').slice(0, 16);
  };

  const formatPrice = (price) => {
    if (!price) return '0';
    return price.toLocaleString();
  };

  const statusLabel = (status) => {
    const labels = { 0: '결제전', 1: '상품준비중', 2: '배송중', 3: '배송완료', 4: '취소/환불' };
    return labels[status] || '알수없음';
  };

  const statusStyle = (status) => {
    const styles = {
      0: 'bg-gray-100 text-gray-500',
      1: 'bg-blue-50 text-blue-600',
      2: 'bg-amber-50 text-amber-600',
      3: 'bg-emerald-50 text-emerald-600',
      4: 'bg-red-50 text-red-500'
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
              <button onClick={async () => { if (!window.confirm("이 회원을 비활성화하시겠습니까?")) return; try { await adminDeleteMember(memberId); alert("처리되었습니다."); navigate('/admin/members'); } catch { alert("삭제에 실패했습니다."); } }}
                className="px-5 py-2.5 text-sm font-semibold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">삭제</button>
              <button onClick={() => navigate(`/admin/members/${memberId}/modify`)} className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">수정</button>
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
                    이메일 인증됨
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{member.mname}</h3>
              <p className="text-sm text-gray-400 mt-1">{member.loginId}</p>
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">회원번호</label>
                  <p className="text-sm text-gray-800">{member.id}</p>
                </div>
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
                  <p className="text-sm text-gray-800">{formatGender(member.gender)}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">가입일</label>
                  <p className="text-sm text-gray-800">{formatDateTime(member.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">최근 수정일</label>
                  <p className="text-sm text-gray-800">{formatDateTime(member.updatedAt)}</p>
                </div>
                {member.isDeleted && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">탈퇴일</label>
                    <p className="text-sm text-red-500 font-medium">{formatDateTime(member.withdrawAt)}</p>
                  </div>
                )}
              </div>
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
                      <th className="px-6 py-3 w-40 text-left font-semibold">주문번호</th>
                      <th className="px-4 py-3 w-32 text-center font-semibold">상태</th>
                      <th className="px-4 py-3 text-left font-semibold">상품명</th>
                      <th className="px-4 py-3 w-16 text-center font-semibold">수량</th>
                      <th className="px-4 py-3 w-28 text-right font-semibold">결제금액</th>
                      <th className="px-6 py-3 w-36 text-center font-semibold">주문일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.orderId} className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors">
                        <td className="px-6 py-4 text-left text-gray-700 font-medium text-xs">
                          {order.tossOrderId || `ORDER_${order.orderId}`}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyle(order.status)}`}>
                            {statusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-left text-gray-800">
                          {order.items && order.items.length > 0 ? (
                            <>
                              {order.items[0].productName}
                              {order.items.length > 1 && <span className="text-gray-400 ml-1">외 {order.items.length - 1}건</span>}
                            </>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-4 text-center text-gray-600">
                          {order.items ? order.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0}
                        </td>
                        <td className="px-4 py-4 text-right font-medium text-gray-800">{formatPrice(order.totalPrice)}원</td>
                        <td className="px-6 py-4 text-center text-gray-400 text-xs">{formatDateTime(order.createdAt)}</td>
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
