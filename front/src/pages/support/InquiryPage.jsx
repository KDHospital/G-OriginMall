import React, { useState, useEffect } from 'react';
import BasicLayout from '../../layouts/BasicLayout';
import UserSupportComponent from '../../components/support/UserSupportComponent';
import PaginationComponent from '../../components/support/PaginationComponent';
import InquiryAddModal from './InquiryAddModal'; 
import { fetchInquiries } from '../../api/boardApi'; 

const InquiryPage = () => {
  const [openIdx, setOpenIdx] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inquiries, setInquiries] = useState([]); 
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); 
  const itemsPerPage = 10;

  const loadData = async (pageNumber) => {
    try {
      const data = await fetchInquiries(pageNumber - 1, itemsPerPage);

      const serverData = data.content || []; 
      setInquiries(serverData);
      setTotalItems(data.totalElements || 0); 

      if (serverData && serverData.length > 0) {
        setInquiries(serverData);
        setTotalItems(data.totalElements || 30);
      } else {

        setInquiries([]);
      }

    } catch (error) {
      console.error("데이터 로드 실패:", error);
      // 에러 발생 시 사용자 경험을 위해 빈 목록 처리
      setInquiries([]);
    }
  };

  useEffect(() => {
    loadData(currentPage);
    setOpenIdx(null); 
  }, [currentPage]);

  const handleRowClick = (idx, idx) => {
    if (item.isPublic === false || item.isPublic === 0) {
      alert("비밀글은 작성자만 확인할 수 있습니다.");
      return;
    }
    setOpenIdx(openIdx === idx ? null : idx);
  };

 

  return (
    <BasicLayout>
      <UserSupportComponent>
        {/* 상단 라인 일치를 위한 음수 마진 */}
        <div className="w-full -mt-[62px]"> 
          
          {/* 타이틀 영역 */}
          <div className="flex justify-between items-center pb-6 border-b border-gray-100">
            <h2 className="text-[22px] font-bold text-[#1D3C28] leading-none">고객문의</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-[#1D3C28] text-white text-[13px] font-medium rounded-sm hover:bg-[#2d5a3c] transition-all"
            >
              문의하기
            </button>
          </div>

          {/* 리스트 테이블 영역 */}
          <div className="border-t-2 border-gray-800">
            <table className="w-full text-[13px] border-collapse table-fixed">
              <thead>
                <tr className="bg-[#F9F9FB] border-b border-gray-100 text-gray-600">
                  <th className="py-4 w-16 font-normal">번호</th>
                  <th className="py-4 w-24 font-normal">상태</th>
                  <th className="py-4 text-left px-6 font-normal">제목</th>
                  <th className="py-4 w-28 font-normal">작성자</th>
                  <th className="py-4 w-32 font-normal">작성일</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length > 0 ? (
                  inquiries.map((item, idx) => {
                    // 답변 완료 조건: 답변 내용이 있고, 삭제되지 않았을 때
                    const isAnswered = item.answers && item.answers.length > 0;

                    return (
                      <React.Fragment key={item.postId}>
                        <tr 
                          className={`border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${openIdx === idx ? 'bg-[#F9F9FB]' : ''}`}
                          onClick={() => handleRowClick(item, idx)}
                        >
                          <td className="py-5 text-center text-gray-400 font-light">{item.postId}</td>
                          <td className="py-5 text-center px-2">
                            <span className={`px-2 py-1 rounded-sm text-[11px] border block ${
                              isAnswered ? 'border-[#4CAF50] text-[#4CAF50]' : 'border-[#FF9800] text-[#FF9800]'
                            }`}>
                              {isAnswered ? '답변완료' : '답변대기'}
                            </span>
                          </td>
                          <td className="py-5 px-6 text-left text-gray-700 truncate font-medium">
                            {(!item.isPublic === false || item.isPublic === 0)
                            ? `🔒 비밀글입니다.` : item.title}
                          </td>
                          <td className="py-5 text-center text-gray-500">{item.mname || item.MName}</td>
                          <td className="py-5 text-center text-gray-400 font-light">
                            {item.createdAt ? item.createdAt.split('T')[0] : '-'}
                          </td>
                        </tr>
                        
                        {/* 아코디언 상세 내용 */}
                        {openIdx === idx && (
                          <tr className="bg-[#F9F9FB] border-b border-gray-100">
                            <td colSpan="5" className="p-10 px-16 animate-fadeIn">
                              <div className="flex gap-6 mb-6">
                                <span className="text-gray-300 font-bold text-2xl">Q.</span>
                                <div className="text-gray-600 text-[14px] leading-relaxed">{item.content}</div>
                              </div>
                              
                              {/* 답변이 있고 삭제되지 않은 경우에만 답변 노출 [cite: 2026-03-30] */}
                              {isAnswered && (
                                <div className="bg-white p-6 border border-gray-100 rounded-sm flex gap-6 shadow-sm">
                                  <span className="font-bold text-[#1D3C28] text-xl">A.</span>
                                  <div>
                                    <div className="text-gray-700 text-[14px] leading-relaxed mb-2">{item.answerContent}</div>
                                    <div className="text-gray-400 text-[11px]">{item.answeredAt?.split('T')[0]}</div>
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-20 text-center text-gray-400">등록된 문의사항이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 하단 페이지네이션 */}
          <div className="py-10">
            <PaginationComponent 
              currentPage={currentPage} 
              totalItems={totalItems} 
              itemsPerPage={itemsPerPage} 
              onPageChange={(page) => setCurrentPage(page)} 
            />
          </div>
        </div>

        {/* 문의 등록 모달 */}
        <InquiryAddModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onRefresh={() => loadData(currentPage)} 
        />
      </UserSupportComponent>
    </BasicLayout>
  );
};

export default InquiryPage;