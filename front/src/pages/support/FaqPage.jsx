import React, { useState } from 'react';
import UserSupportComponent from '../../components/support/UserSupportComponent';
import BasicLayout from '../../layouts/BasicLayout';

const FaqPage = () => {
  // 1. 상태 관리: 현재 선택된 탭과 펼쳐진 아코디언 인덱스
  const [activeTab, setActiveTab] = useState('회원/정보');
  const [openIdx, setOpenIdx] = useState(null);

  // 2. 탭 메뉴 구성 (WF_09 v.1.2 기준)
  const faqTabs = [
    { name: '회원/정보', icon: '👤' },
    { name: '주문/결제', icon: '💳' },
    { name: '배송', icon: '🚚' },
    { name: '취소/교환/반품', icon: '🔄' },
    { name: '서비스/기타', icon: '💡' },
    { name: '입점문의', icon: '🤝' },
  ];

  // 3. 탭별 FAQ 더미 데이터 (넉넉히 10개 이상씩 작성)
  const faqData = {
    '회원/정보': [
      { q: '[배송] 배송 기간은 얼마나 걸리나요?', a: 'G-Origin Mall의 배송은 기본적으로 평일 기준 2~3일 소요됩니다. 산간 도서 지역이나 악천후 등 상황에 따라 지연될 수 있습니다.' },
      { q: '[취소/환불] 상품이 훼손되어 왔어요. 어떻게 하나요?', a: '불편을 드려 죄송합니다. 마이페이지 > 주문내역에서 훼손 사진과 함께 교환/반품 신청을 해주시면 신속히 처리해 드립니다.' },
      { q: '[회원] 회원 등급 혜택은 무엇인가요?', a: '구매 금액에 따라 골드, 그린 등급으로 나누어지며 전용 쿠폰이 발급됩니다.' },
      { q: '비밀번호를 분실했어요.', a: '로그인 화면의 [비밀번호 찾기]를 통해 이메일이나 휴대폰 인증 후 재설정 가능합니다.' },
      { q: '아이디를 변경하고 싶어요.', a: '죄송하지만 가입된 아이디는 변경이 불가능합니다. 탈퇴 후 재가입하셔야 합니다.' },
      { q: '개인정보 수정은 어디서 하나요?', a: '마이페이지 > 회원정보 관리 메뉴에서 수정하실 수 있습니다.' },
      { q: '휴면 계정은 무엇인가요?', a: '1년 이상 로그인 기록이 없는 계정은 개인정보 보호를 위해 휴면 처리됩니다.' },
      { q: '회원 탈퇴는 어떻게 하나요?', a: '마이페이지 > 회원정보 관리 최하단의 [회원탈퇴] 버튼을 통해 진행됩니다.' },
      { q: '추천인 아이디 혜택이 있나요?', a: '현재 신규 가입 시 추천인 아이디를 입력하시면 두 분 모두에게 포인트 적립 혜택을 드리고 있습니다.' },
      { q: '단체 회원 가입이 가능한가요?', a: '네, 고객센터를 통해 단체 회원 가입 문의를 주시면 별도의 절차를 안내해 드립니다.' },
    ],
    '주문/결제': [
      { q: '비회원 주문이 가능한가요?', a: '네, 비회원으로도 주문 가능하지만 회원 혜택(포인트, 쿠폰 등)은 받으실 수 없습니다.' },
      { q: '대량 주문은 어떻게 하나요?', a: '100개 이상의 대량 주문은 별도의 문의 채널이나 고객센터를 통해 상담해 드립니다.' },
      { q: '결제 수단은 무엇이 있나요?', a: '신용카드, 계좌이체, 무통장 입금, 휴대폰 결제, 페이코 등 다양한 수단을 지원합니다.' },
      { q: '입금 확인은 언제 되나요?', a: '무통장 입금의 경우 평일 기준 1~2시간 이내에 자동 확인됩니다.' },
      { q: '주문 내용을 변경하고 싶어요.', a: '[결제완료] 상태까지는 마이페이지에서 직접 변경 가능합니다.' },
      { q: '현금영수증 발행이 가능한가요?', a: '네, 결제 시 현금영수증 발행 옵션을 선택하시거나 마이페이지에서 신청 가능합니다.' },
      { q: '쿠폰 적용이 안 돼요.', a: '쿠폰의 유효기간, 최소 주문 금액, 적용 대상 상품 등을 다시 한번 확인해 주세요.' },
      { q: '가상계좌 입금 기한은 언제까지인가요?', a: '주문 완료 후 24시간 이내에 입금해 주셔야 주문이 취소되지 않습니다.' },
      { q: '주문 내역은 어디서 확인하나요?', a: '상단 메뉴의 [마이페이지] > [주문내역]에서 확인 가능합니다.' },
      { q: '결제 실패 오류가 떠요.', a: '카드사 한도 초과, 통신 오류 등 다양한 원인이 있을 수 있으니 잠시 후 다시 시도해 주세요.' },
    ],
    // 나머지 탭 배송, 취소/교환/반품, 서비스/기타, 입점문의도 동일한 패턴으로 데이터 작성 (코드 생략)
  };

  // 4. 이벤트 핸들러: 아코디언 펼치기/접기
  const toggleAccordion = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <BasicLayout>
    <UserSupportComponent 
      title="자주하는 질문" 
      description="가장 궁금해하시는 내용을 모았습니다."
    >
      <div className="border-t-[1px] border-gray-800">
        
        {/* 5. 주제별 탭 메뉴 UI */}
        <div className="flex border-b mb-8">
          {faqTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                setActiveTab(tab.name);
                setOpenIdx(null); // 탭 변경 시 아코디언 초기화
              }}
              className={`flex-1 flex flex-col items-center justify-center pt-5 pb-3 gap-2 border-r transition-all ${
                activeTab === tab.name 
                  ? 'border-t-2 border-t-[#1D3C28] text-[#1D3C28] font-bold' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[13px]">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* 6. 아코디언 FAQ 목록 UI */}
        <div className="space-y-3">
          {/* 선택된 탭의 데이터가 없으면 안내 문구 노출 */}
          {!faqData[activeTab] || faqData[activeTab].length === 0 ? (
            <div className="text-center py-16 text-gray-400">데이터를 준비 중입니다.</div>
          ) : (
            // 데이터가 있으면 아코디언 목록 렌더링
            faqData[activeTab].map((item, idx) => (
              <div key={idx} className="border border-gray-100 rounded-sm">
                
                {/* 질문 (Question) 영역 */}
                <button
                  onClick={() => toggleAccordion(idx)}
                  className={`w-full flex justify-between items-center px-6 py-5 text-left text-sm transition-all ${
                    openIdx === idx ? 'bg-[#F9F9FB] font-medium' : ''
                  }`}
                >
                  <span className="text-gray-800 leading-relaxed">{item.q}</span>
                  <span className="text-lg text-gray-400 font-light">
                    {openIdx === idx ? '-' : '+'}
                  </span>
                </button>

                {/* 답변 (Answer) 영역 - 펼쳤을 때만 노출 */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    openIdx === idx ? 'max-h-[500px] border-t border-gray-100' : 'max-h-0'
                  }`}
                >
                  <div className="px-8 py-8 bg-[#FFFEEB]/50">
                    <div className="flex gap-4">
                      <span className="font-bold text-[#1D3C28] text-lg">A.</span>
                      <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </UserSupportComponent>
    </BasicLayout>
  );
};

export default FaqPage;