import React, { useState } from 'react';
import UserSupportComponent from '../../components/support/UserSupportComponent';
import BasicLayout from '../../layouts/BasicLayout';
import { faqTabs, faqData } from '../../data/faqData';

const FaqPage = () => {
  const [activeTab, setActiveTab] = useState('회원/정보');
  const [openIdx, setOpenIdx] = useState(null);


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

        {/* 탭 메뉴 */}
        <div className="flex border-b mb-8">
          {faqTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                setActiveTab(tab.name);
                setOpenIdx(null);
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

        {/* 아코디언 FAQ 목록 */}
        <div className="space-y-3">
          {!faqData[activeTab] || faqData[activeTab].length === 0 ? (
            <div className="text-center py-16 text-gray-400">데이터를 준비 중입니다.</div>
          ) : (
            faqData[activeTab].map((item, idx) => (
              <div key={idx} className="border border-gray-100 rounded-sm">
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
