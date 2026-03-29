import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UserSupportComponent = ({ children, title, description }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    { name: '공지사항', path: '/board' },
    { name: '자주하는 질문', path: '/faq' },
    { name: '고객문의', path: '/inquiry' },
  ];

  return (
    <div className="max-w-[1050px] mx-auto pt-12 pb-20 px-5 font-sans">
      
      {/* 1. 전체 영역을 플렉스로 묶고 상단 정렬 고정 */}
      <div className="flex gap-x-10 items-start">
        
        {/* 2. 좌측 영역: 제목 + 사이드바 */}
        <div className="w-48 flex-shrink-0">
          <h2 className="text-2xl font-bold text-[#1D3C28] mb-7 tracking-tight">고객센터</h2>
          
          <nav className="border-t border-gray-800">
            {menus.map((menu) => (
              <button
                key={menu.path}
                onClick={() => navigate(menu.path)}
                className={`w-full text-left py-4 px-4 border-b border-gray-100 flex justify-between items-center transition-all ${
                  location.pathname.startsWith(menu.path)
                    ? 'bg-[#F8F9F4] text-[#1D3C28] font-bold'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="text-[14px]">{menu.name}</span>
                <span className={`text-[10px] ${location.pathname.startsWith(menu.path) ? 'text-[#1D3C28]' : 'text-gray-300'}`}>{'>'}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 3. 우측 영역: 소제목 + 콘텐츠 */}
        <div className="flex-1 min-w-0">
          <div className="mb-7 flex items-baseline gap-3 h-[32px]">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            {description && (
              <span className="text-gray-400 text-[12px] font-normal">{description}</span>
            )}
          </div>
          
          {/* 실제 게시판 표(InquiryPage의 table)가 들어오는 위치 */}
          <div className="content-body">
            {children}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default UserSupportComponent;