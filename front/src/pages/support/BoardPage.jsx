import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSupportComponent from '../../components/support/UserSupportComponent';
import BasicLayout from '../../layouts/BasicLayout';

const BoardPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지당 10개씩 노출

  // 1. 더미 데이터 20개 이상 생성 (WF_09_공지사항목록_v1.1 기준 반영)
  const allNotices = [
    { id: 30, title: '[안내] 2026년 봄 특산물 행사 안내', writer: '관리자', date: '2026-03-25', views: '1,240', isPin: true },
    { id: 29, title: '개인정보처리방침 개정 안내', writer: '관리자', date: '2026-03-20', views: '452', isPin: true },
    { id: 28, title: '3월 기획전 배송 지연 안내', writer: '관리자', date: '2026-03-08', views: '88', isPin: false },
    { id: 27, title: '봄철 특산물 입고 안내', writer: '관리자', date: '2026-03-05', views: '213', isPin: false },
    { id: 26, title: '결제 시스템 점검 안내 (토스페이)', writer: '관리자', date: '2026-02-28', views: '175', isPin: false },
    { id: 25, title: '금빛나루 인증 상품 추가 등록 안내', writer: '관리자', date: '2026-02-20', views: '301', isPin: false },
    { id: 24, title: '배송지 등록 기능 업데이트 안내', writer: '관리자', date: '2026-02-15', views: '198', isPin: false },
    { id: 23, title: '설 연휴 배송 일정 안내', writer: '관리자', date: '2026-01-25', views: '512', isPin: false },
    { id: 22, title: '회원가입 이메일 인증 절차 안내', writer: '관리자', date: '2026-01-15', views: '429', isPin: false },
    { id: 21, title: '판매자 입점 안내 및 신청 방법', writer: '관리자', date: '2026-01-10', views: '386', isPin: false },
    // 추가 데이터 (20개 이상을 위해 자동 생성 패턴)
    ...Array.from({ length: 15 }, (_, i) => ({
      id: 20 - i,
      title: `G-Origin Mall 서비스 이용 안내 (${20 - i})`,
      writer: '관리자',
      date: `2026-01-${String(Math.max(1, 9 - i)).padStart(2, '0')}`,
      views: Math.floor(Math.random() * 500),
      isPin: false
    }))
  ];

  // 2. 페이지네이션 계산 로직
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allNotices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allNotices.length / itemsPerPage);

  return (
    <BasicLayout>
    <UserSupportComponent 
      title="공지사항" 
      description="G-Origin Mall의 새로운 소식들과 유용한 정보들을 확인하세요."
    >
      {/* 표 상단 선 두께 1/2 반영 (border-t) */}
      <div className="border-t border-gray-800">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="bg-[#F9F9FB] border-b border-gray-100 text-gray-600 font-normal">
              <th className="py-3 w-16 font-normal text-center">번호</th>
              <th className="py-3 text-left px-4 font-normal">제목</th>
              <th className="py-3 w-24 font-normal text-center">작성자</th>
              <th className="py-3 w-28 font-normal text-center">작성일</th>
              <th className="py-3 w-20 font-normal text-center">조회수</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr 
                key={item.id} 
                className={`border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${item.isPin ? 'bg-[#FFFEEB]/50' : ''}`}
                onClick={() => navigate(`/board/read/${item.id}`)} // 상세페이지 이동
              >
                <td className="py-4 text-center text-gray-400">
                  {item.isPin ? <span className="text-[#1D3C28] font-bold">공지</span> : item.id}
                </td>
                <td className="py-4 px-4 text-left text-gray-800 font-medium">
                  <div className="flex items-center gap-2">
                    {item.title}
                    {item.isPin && <span className="bg-[#1D3C28] text-white text-[9px] px-1 rounded-sm">HOT</span>}
                  </div>
                </td>
                <td className="py-4 text-center text-gray-500">{item.writer}</td>
                <td className="py-4 text-center text-gray-400 font-light">{item.date}</td>
                <td className="py-4 text-center text-gray-400">{item.views}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 3. 하단 페이지네이션 UI (컬리 스타일) */}
        <div className="flex justify-center items-center gap-1 mt-12">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 text-xs hover:bg-gray-50 disabled:opacity-30"
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 flex items-center justify-center text-xs font-bold transition-all ${
                currentPage === pageNum 
                  ? 'bg-[#333] text-white' 
                  : 'border border-gray-100 text-gray-400 hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 text-xs hover:bg-gray-50 disabled:opacity-30"
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </UserSupportComponent>
    </BasicLayout>
  );
};

export default BoardPage;