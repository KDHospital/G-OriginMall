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

  // 1. 로그인 유저 ID 추출 (로컬스토리지 보완)
  const getLoginUserId = () => {
    const data = localStorage.getItem("member"); 
    if (!data) return null;
    try {
      const parsedData = JSON.parse(data);
      // memberId 또는 id 중 존재하는 값을 반환
      return parsedData.loginId; 
    } catch (error) {
      console.error("로컬스토리지 파싱 에러:", error);
      return null;
    }
  };

  const currentUserId = getLoginUserId();

  // 데이터 로드 함수
const loadData = async (pageNumber) => {
  try {
    const data = await fetchInquiries(pageNumber);
    setTotalItems(data.totalCount || 0); 
    setInquiries(data.dtoList || []); 
    setOpenIdx(null);
  } catch (error) {
    console.error("데이터 로드 실패:", error);
    setInquiries([]);
  }
};

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  // 2. 행 클릭 핸들러: 비밀글 및 본인 확인 로직
  const handleRowClick = (item, idx) => {
    const isPrivate = item.isPublic === false || item.isPublic === 0;
    
    // 서버 응답의 member 객체 내 ID와 비교
    const writerId = item.loginId;
    const isOwner = currentUserId && String(writerId) === String(currentUserId);

    if (isPrivate && !isOwner) {
      alert("비밀글은 작성자만 확인할 수 있습니다.");
      return;
    }
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <BasicLayout>
      <UserSupportComponent>
        <div className="w-full -mt-[62px]"> 
          <div className="flex justify-between items-center pb-6 border-b border-gray-100">
            <h2 className="text-[22px] font-bold text-[#1D3C28] leading-none">고객문의</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 bg-[#1D3C28] text-white text-[13px] font-medium rounded-sm hover:bg-[#2d5a3c] transition-all"
            >
              문의하기
            </button>
          </div>

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
                    const isAnswered = item.answers && item.answers.length > 0;
                    const virtualNumber = totalItems - (currentPage - 1) * itemsPerPage - idx;
                    const isPrivate = item.isPublic === false || item.isPublic === 0;
                    
                    // 작성자 ID 추출 (member 객체 우선 참조)
                    const writerId = item.member?.memberId || item.memberId;
                    const isOwner = currentUserId && String(writerId) === String(currentUserId);

                    return (
                      <React.Fragment key={item.postId || idx}>
                        <tr 
                          className={`border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${openIdx === idx ? 'bg-[#F9F9FB]' : ''}`}
                          onClick={() => handleRowClick(item, idx)}
                        >
                          <td className="py-5 text-center text-gray-400 font-light">{virtualNumber}</td>
                          <td className="py-5 text-center px-2">
                            <span className={`px-2 py-1 rounded-sm text-[11px] border block ${
                              isAnswered ? 'border-[#4CAF50] text-[#4CAF50]' : 'border-[#FF9800] text-[#FF9800]'
                            }`}>
                              {isAnswered ? '답변완료' : '답변대기'}
                            </span>
                          </td>
                          <td className="py-5 px-6 text-left text-gray-700 truncate font-medium">
                            <div className="flex items-center gap-1">
                              {isPrivate && <span className="text-gray-400">🔒 </span>}
                              {/* 본인이 아니면 제목을 가림 */}
                              {isPrivate && !isOwner ? "비밀글입니다." : item.title}
                              {isOwner && <span className="ml-2 text-[10px] text-green-600 font-bold">[내 문의]</span>}
                            </div>
                          </td>
                          <td className="py-5 text-center text-gray-500">
                            {/* 작성자 이름 표시 */}
                            {item.mname || '익명'}
                          </td>
                          <td className="py-5 text-center text-gray-400 font-light">
                            {item.createdAt ? item.createdAt.split('T')[0] : '-'}
                          </td>
                        </tr>
                        
                        {openIdx === idx && (
                          <tr className="bg-[#F9F9FB] border-b border-gray-100">
                            <td colSpan="5" className="p-10 px-16 animate-fadeIn">
                              <div className="flex gap-6 mb-6">
                                <span className="text-gray-300 font-bold text-2xl">Q.</span>
                                <div className="text-gray-600 text-[14px] leading-relaxed whitespace-pre-wrap">
                                  {item.content}
                                </div>
                              </div>
                              
                              {isAnswered && (
                                <div className="bg-white p-6 border border-gray-100 rounded-sm flex gap-6 shadow-sm">
                                  <span className="font-bold text-[#1D3C28] text-xl">A.</span>
                                  <div>
                                    <div className="text-gray-700 text-[14px] leading-relaxed mb-2 whitespace-pre-wrap">
                                      {item.answers[0].content} 
                                    </div>
                                    <div className="text-gray-400 text-[11px]">
                                      {item.answers[0].createdAt?.split('T')[0]}
                                    </div>
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

          <div className="py-10">
            <PaginationComponent 
              currentPage={currentPage} 
              totalItems={totalItems} 
              itemsPerPage={itemsPerPage} 
              onPageChange={(page) => setCurrentPage(page)} 
            />
          </div>
        </div>

        {/* 모달 닫힐 때 1페이지로 새로고침하여 내 글 확인 */}
        <InquiryAddModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onRefresh={() => {
             setCurrentPage(1);
             loadData(1);
          }} 
        />
      </UserSupportComponent>
    </BasicLayout>
  );
};

export default InquiryPage;