import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicLayout from '../../layouts/BasicLayout';
import UserSupportComponent from '../../components/support/UserSupportComponent';
import PaginationComponent from '../../components/support/PaginationComponent';

const InquiryPage = () => {
  const navigate = useNavigate(); //
  const [openIdx, setOpenIdx] = useState(null); // 펼침 상태 관리

  // 화면에 보이는 데이터 구성
  const inquiries = Array.from({ length: 10 }, (_, i) => ({
    id: 24 - i,
    status: i % 3 === 0 ? '답변완료' : '답변대기',
    title: i === 2 ? '🔒 비밀글입니다.' : `배송 관련 문의드립니다. ${24 - i}`,
    writer: 'user***',
    date: '2026-03-30',
    views: Math.floor(Math.random() * 50),
    isSecret: i === 2,
    question: `안녕하세요. ${24 - i}번 문의사항 상세 내용입니다.`,
    answer: i % 3 === 0 ? "정성스러운 답변이 완료되었습니다. 감사합니다." : null
  }));

  const handleRowClick = (idx, isSecret) => {
    if (isSecret) {
      alert("비밀글은 작성자만 확인할 수 있습니다.");
      return;
    }
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <BasicLayout>
      <UserSupportComponent>
        {/* [검증 완료] 상단 라인 일치를 위한 음수 마진 설정 */}
        <div className="w-full -mt-[62px]"> 
          
          {/* 타이틀 및 버튼 영역 */}
          <div className="flex justify-between items-center pb-6 border-b border-gray-100">
            <div className="flex items-baseline gap-3">
              <h2 className="text-[22px] font-bold text-[#1D3C28] leading-none">고객문의</h2>
              <span className="text-[13px] text-gray-400 font-normal">궁금하신 점이 있나요? 정성을 다해 답변해 드립니다.</span>
            </div>
            <button 
              onClick={() => navigate('/inquiry/add')} //
              className="px-5 py-2.5 bg-[#1D3C28] text-white text-[13px] font-medium rounded-sm hover:bg-[#2d5a3c] transition-all"
            >
              문의하기
            </button>
          </div>

          {/* 리스트 표 영역 */}
          <div className="border-t-2 border-gray-800">
            <table className="w-full text-[13px] border-collapse table-fixed">
              <thead>
                <tr className="bg-[#F9F9FB] border-b border-gray-100 text-gray-600">
                  <th className="py-4 w-16 font-normal">번호</th>
                  <th className="py-4 w-24 font-normal">답변 상태</th>
                  <th className="py-4 text-left px-6 font-normal">제목</th>
                  <th className="py-4 w-28 font-normal">작성자</th>
                  <th className="py-4 w-32 font-normal">작성일</th>
                  <th className="py-4 w-20 font-normal">조회수</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    <tr 
                      className={`border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${openIdx === idx ? 'bg-[#F9F9FB]' : ''}`}
                      onClick={() => handleRowClick(idx, item.isSecret)}
                    >
                      <td className="py-5 text-center text-gray-400 font-light">{item.id}</td>
                      <td className="py-5 text-center px-2">
                        <span className={`px-2 py-1 rounded-sm text-[11px] border block ${
                          item.status === '답변완료' ? 'border-[#4CAF50] text-[#4CAF50]' : 'border-[#FF9800] text-[#FF9800]'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-left text-gray-700 truncate font-medium">{item.title}</td>
                      <td className="py-5 text-center text-gray-500">{item.writer}</td>
                      <td className="py-5 text-center text-gray-400 font-light">{item.date}</td>
                      <td className="py-5 text-center text-gray-400 font-light">{item.views}</td>
                    </tr>
                    
                    {/* 아코디언 상세 영역 */}
                    {openIdx === idx && (
                      <tr className="bg-[#F9F9FB] border-b border-gray-100">
                        <td colSpan="6" className="p-10 px-16">
                          <div className="flex gap-6 mb-6">
                            <span className="text-gray-300 font-bold text-2xl">Q.</span>
                            <div className="text-gray-600 text-[14px] leading-relaxed">{item.question}</div>
                          </div>
                          {item.answer && (
                            <div className="bg-white p-6 border border-gray-100 rounded-sm flex gap-6 shadow-sm">
                              <span className="font-bold text-[#1D3C28] text-xl">A.</span>
                              <div className="text-gray-700 text-[14px] leading-relaxed">{item.answer}</div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="py-10">
            <PaginationComponent />
          </div>
        </div>
      </UserSupportComponent>
    </BasicLayout>
  );
};

export default InquiryPage;