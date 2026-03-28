import React, { useState } from 'react';
import UserSupportComponent from '../../components/support/UserSupportComponent';
import BasicLayout from '../../layouts/BasicLayout';

const InquiryPage = () => {
  const [openIdx, setOpenIdx] = useState(null);

  // WF_10_고객문의_v.1.1 기준 하드코딩 데이터
  const inquiries = [
    { 
      id: 24, status: '답변완료', title: '배송 관련 문의드립니다.', writer: 'hong***', date: '2026-03-08', views: 12, isSecret: false,
      question: '주문한 상품이 아직 배송 시작이 안 된 것 같은데 확인 부탁드립니다.',
      answer: '안녕하세요. 문의 주셔서 감사합니다. 해당 상품은 현재 출고 준비 중이며 내일 발송 예정입니다. 불편을 드려 죄송합니다.'
    },
    { id: 23, status: '답변대기', title: '상품 교환 가능한지 문의합니다.', writer: 'kim***', date: '2026-03-07', views: 8, isSecret: false },
    { id: 22, status: '비밀글입니다.', writer: 'lee***', date: '2026-03-06', views: '-', isSecret: true, status: '답변완료' },
    { id: 21, status: '답변완료', title: '김포 쌀 재고 문의', writer: 'park***', date: '2026-03-05', views: 34, isSecret: false },
    { id: 20, status: '답변대기', title: '결제 오류 관련 문의', writer: 'choi***', date: '2026-03-04', views: 19, isSecret: false },
    { id: 19, status: '답변완료', title: '배송지 변경 문의', writer: 'yoon***', date: '2026-03-02', views: 27, isSecret: false },
    { id: 18, status: '답변완료', title: '인삼 상품 원산지 확인 요청', writer: 'shin***', date: '2026-02-28', views: 45, isSecret: false },
    { id: 17, status: '답변대기', title: '회원 정보 수정이 안 됩니다.', writer: 'jung***', date: '2026-02-25', views: 11, isSecret: false },
  ];

  const handleRowClick = (idx, isSecret) => {
    if (isSecret) {
      alert("비밀글입니다. 작성자만 확인 가능합니다.");
      return;
    }
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <BasicLayout>
    <UserSupportComponent 
      title="고객문의" 
      description="궁금하신 점이 있나요? G-Origin이 정성을 다해 답변해 드립니다."
    >
      <div className="border-t-[1px] border-gray-800">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="bg-[#F9F9FB] border-b text-gray-600 font-normal">
              <th className="py-3 w-12 font-normal">번호</th>
              <th className="py-3 w-20 font-normal">답변 상태</th>
              <th className="py-3 text-left px-4 font-normal">제목</th>
              <th className="py-3 w-24 font-normal">작성자</th>
              <th className="py-3 w-28 font-normal">작성일</th>
              <th className="py-3 w-16 font-normal">조회수</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((item, idx) => (
              <React.Fragment key={item.id}>
                <tr 
                  className={`border-b cursor-pointer hover:bg-gray-50 transition-colors ${openIdx === idx ? 'bg-[#F4F7FA]' : ''}`}
                  onClick={() => handleRowClick(idx, item.isSecret)}
                >
                  <td className="py-4 text-center text-gray-400">{item.id}</td>
                  <td className="py-4 text-center">
                    <span className={`px-2 py-[2px] rounded-sm text-[11px] font-bold ${
                      item.status === '답변완료' 
                        ? 'border border-[#4CAF50] text-[#4CAF50]' 
                        : 'border border-[#FF9800] text-[#FF9800]'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-left text-gray-700">
                    <div className="flex items-center gap-2">
                      {item.isSecret && <span className="text-gray-400 text-[10px]">🔒</span>}
                      <span className={item.isSecret ? 'text-gray-400' : ''}>{item.title}</span>
                      {item.id === 24 && <span className="bg-[#FF4D4D] text-white text-[9px] px-1 rounded-sm font-bold">N</span>}
                      {item.id === 24 && <span className="text-gray-300 text-[10px]">▲ 설정</span>}
                    </div>
                  </td>
                  <td className="py-4 text-center text-gray-500">{item.writer}</td>
                  <td className="py-4 text-center text-gray-400 font-light">{item.date}</td>
                  <td className="py-4 text-center text-gray-400">{item.views}</td>
                </tr>
                
                {/* Q&A 펼침 영역: WF_10의 상세 디자인 반영 */}
                {openIdx === idx && (
                  <tr className="bg-white border-b">
                    <td colSpan="6" className="p-8 px-14 bg-[#F9F9FB]">
                      <div className="flex gap-4 mb-6">
                        <span className="text-gray-400 font-bold text-lg">Q.</span>
                        <div className="flex-1">
                          <p className="text-gray-600 leading-relaxed mb-2">{item.question}</p>
                          <p className="text-[11px] text-gray-300 font-mono italic">
                            post.content · post.member_id → member.mname
                          </p>
                        </div>
                      </div>
                      
                      {item.answer && (
                        <div className="bg-[#FFFEEB] p-6 border border-[#E0DDBB] rounded-sm relative">
                          <div className="flex gap-4">
                            <span className="font-bold text-[#1D3C28] whitespace-nowrap">관리자 답변</span>
                            <div className="flex-1">
                              <p className="text-[11px] text-gray-400 mb-2 font-mono">
                                answer.admin_id → member.mname
                              </p>
                              <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* 페이징 영역 */}
        <div className="flex justify-center items-center gap-1 mt-12">
          <button className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 text-xs hover:bg-gray-50">&lt;</button>
          <button className="w-8 h-8 bg-[#333] text-white flex items-center justify-center text-xs font-bold">1</button>
          <button className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-500 text-xs hover:bg-gray-50">2</button>
          <button className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-500 text-xs hover:bg-gray-50">3</button>
          <button className="w-8 h-8 border border-gray-200 flex items-center justify-center text-gray-400 text-xs hover:bg-gray-50">&gt;</button>
        </div>
      </div>
    
    </UserSupportComponent>
    </BasicLayout>
  );
};

export default InquiryPage;