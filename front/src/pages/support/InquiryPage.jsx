import React, { useState, useEffect } from 'react';
import BasicLayout from '../../layouts/BasicLayout';
import UserSupportComponent from '../../components/support/UserSupportComponent';
import PaginationComponent from '../../components/support/PaginationComponent';
import InquiryAddModal from './InquiryAddModal'; 
import { fetchInquiries, getBoardOne } from '../../api/boardApi';

const maskName = (name) => {
  if (!name) return '익명';
  const isEnglish = /^[a-zA-Z\s]+$/.test(name);
  if (isEnglish) {
    return name.split(' ').map(word => {
      if (word.length <= 2) return word[0] + '*';
      return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
    }).join(' ');
  }
  if (name.length === 1) return '*';
  if (name.length === 2) return name[0] + '*';
  if (name.length === 3) return name[0] + '*' + name[2];
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
};

const InquiryPage = () => {
  const [openIdx, setOpenIdx] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); 
  const itemsPerPage = 10;

  // 1. 로그인 유저 정보 추출 (localStorage의 id: 2번 확인)
  const getLoginUserInfo = () => {
    const data = localStorage.getItem("member");
    if (!data) return null;
    try {
      const parsedData = JSON.parse(data);
      return {
        id: parsedData.memberId || parsedData.id || parsedData.mid,
        name: parsedData.mname
      };
    } catch (error) {
      return null;
    }
  };

  const currentUser = getLoginUserInfo();

  const loadData = async (pageNumber) => {
    try {
      const data = await fetchInquiries(pageNumber - 1); 
      setTotalItems(data.totalCount || 0); 
      setInquiries(data.dtoList || []); 
      setOpenIdx(null); 
    } catch (error) {
      setInquiries([]);
    }
  };

  useEffect(() => { loadData(currentPage); }, [currentPage]);

  return (
    <BasicLayout>
      <UserSupportComponent>
        <div className="w-full -mt-[62px]"> 
          <div className="flex justify-between items-center pb-6 border-b border-gray-100">
            <h2 className="text-[22px] font-bold text-[#1D3C28]">고객문의</h2>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="px-5 py-2.5 bg-[#1D3C28] text-white text-[13px] rounded-sm hover:bg-[#2d5a3c]"
            >
              문의하기
            </button>
          </div>

          <div className="border-t-2 border-gray-800">
            <table className="w-full text-[13px] border-collapse table-fixed text-center">
              <thead>
                <tr className="bg-[#F9F9FB] border-b border-gray-100 text-gray-600 font-normal">
                  <th className="py-4 w-16">번호</th>
                  <th className="py-4 w-24">상태</th>
                  <th className="py-4 text-left px-6">제목</th>
                  <th className="py-4 w-28">작성자</th>
                  <th className="py-4 w-32">작성일</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length > 0 ? inquiries.map((item, idx) => {
                  const virtualNumber = totalItems - (currentPage - 1) * itemsPerPage - idx;
                  
                  const isPublic = item.isPublic === true;

                  const writerId = item.memberId;
                  
                  const isOwner = currentUser && writerId && String(writerId) === String(currentUser.id);

                  return (
                    <React.Fragment key={item.postId || idx}>
                      <tr 
                        className={`border-b border-gray-50 cursor-pointer hover:bg-gray-50 ${openIdx === idx ? 'bg-[#F9F9FB]' : ''}`} 
                        onClick={async () => {
                          if (!isPublic && !isOwner) {
                            alert("비밀글은 작성자만 확인할 수 있습니다.");
                            return;
                          }
                          if (openIdx === idx) {
                            setOpenIdx(null);
                            setDetailData(null);
                            return;
                          }
                          setOpenIdx(idx);
                          setDetailLoading(true);
                          try {
                            const data = await getBoardOne(item.postId);
                            setDetailData(data);
                          } catch (err) {
                            console.error("상세 조회 실패:", err);
                            setDetailData(null);
                          } finally {
                            setDetailLoading(false);
                          }
                        }}
                      >
                        <td className="py-5 text-gray-400 font-light">{virtualNumber}</td>
                        <td className="py-5 px-2">
                          <span className={`px-2 py-1 rounded-sm text-[11px] border block ${item.hasAnswer ? 'border-[#4CAF50] text-[#4CAF50]' : 'border-[#FF9800] text-[#FF9800]'}`}>
                            {item.hasAnswer ? '답변완료' : '답변대기'}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-left truncate font-medium">
                          <div className="flex items-center gap-1">
                            {/* 1. 공개글이면 제목 노출 */}
                            {isPublic ? (
                              <span className="text-gray-700">{item.title}</span>
                            ) : (
                              /* 2. 비밀글 처리 */
                              <>
                                <span className="text-gray-400 text-sm">🔒</span>
                                {isOwner ? (
                                  <span className="text-gray-700">{item.title}</span>
                                ) : (
                                  <span className="text-gray-400 italic font-normal">비밀글입니다.</span>
                                )}
                              </>
                            )}

                            {isOwner && (
                              <span className="ml-2 text-[10px] text-green-600 font-bold shrink-0">[내 문의]</span>
                            )}
                          </div>
                        </td>
                        <td className="py-5 text-gray-500 font-normal">
                          {maskName(item.mName)}
                        </td>
                        <td className="py-5 text-gray-400 font-light">
                          {item.createdAt ? item.createdAt.split('T')[0] : '-'}
                        </td>
                      </tr>
                      
                      {/* 상세 내용 영역 */}
                      {openIdx === idx && (
                        <tr className="bg-[#F9F9FB] border-b border-gray-100 text-left">
                          <td colSpan="5" className="p-10 px-16">
                            {detailLoading ? (
                              <div className="text-center text-gray-400 py-4">불러오는 중...</div>
                            ) : (
                              <>
                                <div className="flex gap-6 mb-6">
                                  <span className="text-gray-300 font-bold text-2xl">Q.</span>
                                  <div className="text-gray-600 text-[14px] leading-relaxed whitespace-pre-wrap">
                                    {detailData?.content || item.content}
                                  </div>
                                </div>
                                {detailData?.answers && detailData.answers.length > 0 && (() => {
                                  const latestAnswer = detailData.answers[detailData.answers.length - 1];
                                  return (
                                    <div className="bg-white p-6 border border-gray-100 rounded-sm flex gap-6 shadow-sm">
                                      <span className="font-bold text-[#1D3C28] text-xl">A.</span>
                                      <div>
                                        <div className="text-gray-700 text-[14px] leading-relaxed mb-2 whitespace-pre-wrap">
                                          {latestAnswer.content}
                                        </div>
                                        <div className="text-gray-400 text-[11px]">
                                          {latestAnswer.createdAt?.replace('T', ' ').slice(0, 16)}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                }) : (
                  <tr>
                    <td colSpan="5" className="py-20 text-center text-gray-400 font-light">
                      등록된 문의사항이 없습니다.
                    </td>
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
      </UserSupportComponent>
      <InquiryAddModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={() => loadData(currentPage)} 
      />
    </BasicLayout>
  );
};

export default InquiryPage;