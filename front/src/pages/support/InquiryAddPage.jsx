import React, { useState } from 'react';
// [중요] useNavigate 사용을 위해 필수 임포트
import { useNavigate } from 'react-router-dom'; 
import BasicLayout from '../../layouts/BasicLayout';
import UserSupportComponent from '../../components/support/UserSupportComponent';

const InquiryAddPage = () => {
  // [중요] 컴포넌트 최상단에서 navigate 선언 (이 부분이 빠지면 화면이 안 나옵니다)
  const navigate = useNavigate(); 
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isSecret: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = () => {
    if(!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    // 데이터 전송 로직 (추후 API 연동 예정)
    console.log("제출 데이터:", formData);
    alert("문의사항이 접수되었습니다.");
    navigate('/inquiry/list'); // 등록 후 목록으로 이동
  };

  return (
    <BasicLayout>
      <UserSupportComponent>
        {/* 상단 라인 일치를 위한 -mt 설정 */}
        <div className="w-full -mt-[62px]">
          
          {/* 타이틀 영역 */}
          <div className="pb-6 border-b border-gray-100">
            <h2 className="text-[22px] font-bold text-[#1D3C28] leading-none">문의하기</h2>
            <p className="text-[13px] text-gray-400 mt-3 font-normal">
              궁금하신 점을 남겨주시면 정성을 다해 답변해 드립니다.
            </p>
          </div>

          {/* 입력 폼 (표 스타일) */}
          <div className="border-t-2 border-gray-800">
            <table className="w-full text-[14px] border-collapse">
              <tbody>
                <tr className="border-b border-gray-100">
                  <th className="w-40 bg-[#F9F9FB] py-5 px-8 text-left font-medium text-gray-700">제목</th>
                  <td className="py-4 px-6">
                    <input 
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="제목을 입력해주세요."
                      className="w-full border border-gray-200 rounded-sm px-4 py-2.5 focus:outline-none focus:border-[#1D3C28] text-[13px]"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <th className="bg-[#F9F9FB] py-5 px-8 text-left font-medium text-gray-700 font-sans">공개 설정</th>
                  <td className="py-4 px-6">
                    <label className="flex items-center gap-2 cursor-pointer group w-fit">
                      <input 
                        type="checkbox"
                        name="isSecret"
                        checked={formData.isSecret}
                        onChange={handleChange}
                        className="w-4 h-4 accent-[#1D3C28]"
                      />
                      <span className="text-[13px] text-gray-600 group-hover:text-[#1D3C28]">비밀글로 문의하기</span>
                    </label>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <th className="bg-[#F9F9FB] py-5 px-8 text-left font-medium text-gray-700 align-top">내용</th>
                  <td className="py-4 px-6">
                    <textarea 
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows="12"
                      placeholder="내용을 상세히 적어주세요."
                      className="w-full border border-gray-200 rounded-sm px-4 py-4 focus:outline-none focus:border-[#1D3C28] text-[13px] resize-none"
                    ></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-center gap-3 py-12">
            <button 
              onClick={() => navigate('/inquiry/list')}
              className="px-10 py-3 border border-gray-200 text-gray-600 text-[14px] font-medium rounded-sm hover:bg-gray-50"
            >
              취소
            </button>
            <button 
              onClick={handleSubmit}
              className="px-10 py-3 bg-[#1D3C28] text-white text-[14px] font-medium rounded-sm hover:bg-[#2d5a3c]"
            >
              등록하기
            </button>
          </div>
        </div>
      </UserSupportComponent>
    </BasicLayout>
  );
};

export default InquiryAddPage;