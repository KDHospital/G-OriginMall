import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserSupportComponent from '../../components/support/UserSupportComponent';
import BasicLayout from '../../layouts/BasicLayout';

const BoardReadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 실제 연동 시에는 id를 기반으로 API 호출을 하겠지만, 현재는 하드코딩 데이터를 사용합니다.
  const noticeDetail = {
    id: id,
    title: '[안내] 2026년 봄 특산물 행사 안내',
    writer: '관리자',
    date: '2026-03-25',
    views: '1,240',
    content: `
      안녕하세요. G-Origin Mall입니다.
      
      2026년 파릇파릇한 봄을 맞이하여 김포의 우수한 특산물을 한데 모은 
      '봄 특산물 대잔치' 행사를 진행하게 되었습니다.
      
      본 행사에서는 금빛나루 인증을 받은 신선한 농산물부터 
      장인의 손길이 담긴 가공식품까지 특별한 가격에 만나보실 수 있습니다.
      
      [행사 안내]
      1. 기간: 2026년 4월 1일 ~ 4월 15일 (15일간)
      2. 혜택: 전 상품 최대 20% 할인 및 무료배송 쿠폰 지급
      3. 대상: G-Origin Mall 모든 회원
      
      풍성한 봄의 맛을 G-Origin Mall과 함께 느껴보시기 바랍니다.
      감사합니다.
    `
  };

  return (
    <BasicLayout>
    <UserSupportComponent 
      title="공지사항" 
      description="G-Origin Mall의 새로운 소식들을 상세히 확인하세요."
    >
      {/* 1. 상단 정렬 선(border-t) */}
      <div className="border-t border-gray-800">
        
        {/* 2. 제목 영역*/}
        <div className="bg-[#F9F9FB] px-8 py-6 border-b border-gray-100">
          <h4 className="text-lg font-bold text-gray-900 mb-4">{noticeDetail.title}</h4>
          <div className="flex text-[13px] text-gray-400 gap-6">
            <div className="flex gap-2">
              <span className="text-gray-500 font-medium">작성자</span>
              <span>{noticeDetail.writer}</span>
            </div>
            <div className="flex gap-2 border-l pl-6 border-gray-200">
              <span className="text-gray-500 font-medium">작성일</span>
              <span>{noticeDetail.date}</span>
            </div>
            <div className="flex gap-2 border-l pl-6 border-gray-200">
              <span className="text-gray-500 font-medium">조회수</span>
              <span>{noticeDetail.views}</span>
            </div>
          </div>
        </div>

        {/* 3. 본문 영역: 와이어프레임 post.content 영역 */}
        <div className="px-8 py-12 min-h-[400px] border-b border-gray-100">
          <div className="text-gray-700 leading-8 whitespace-pre-wrap text-[15px]">
            {noticeDetail.content}
          </div>
          
          {/* 개발 참고용 주석 (WF 메모 반영) */}
          <p className="mt-20 text-[11px] text-gray-300 font-mono italic">
            board.content · board.member_id → member.mname
          </p>
        </div>

        {/* 4. 하단 버튼 영역: 중앙 정렬 목록 버튼 */}
        <div className="py-10 flex justify-center">
          <button 
            onClick={() => navigate('/board')}
            className="px-14 py-3 border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            목록으로
          </button>
        </div>

      </div>
    </UserSupportComponent>
    </BasicLayout>
  );
};

export default BoardReadPage;