import React, { useState } from 'react';
import { addInquiry } from '../../api/boardApi';

const InquiryAddModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    writerName: 'user01', 
    isPublic: true        
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // 비밀글 체크박스 처리 로직 수정
    if (name === "isSecret") {
      setFormData({
        ...formData,
        isPublic: !checked // '비밀글로 작성하기' 체크 시 isPublic은 false가 됨
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      // 서버에 전송 전 데이터 구조 최종 확인
      const sendData = {
        ...formData,
        viewCount: 0,   
        hasAnswer: false
      };

      await addInquiry(sendData); 
      alert("문의사항이 성공적으로 접수되었습니다.");
      
      onRefresh(); 
      onClose();   
      
      // 폼 초기화 (DTO 구조 유지)
      setFormData({ title: '', content: '', writerName: 'user01', isPublic: true });
    } catch (error) {
      console.error("등록 실패:", error);
      alert("서버 통신 중 오류가 발생했습니다. 필드명을 다시 확인해주세요.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded shadow-2xl overflow-hidden animate-fadeIn">
        
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-[20px] font-bold text-[#1D3C28]">고객문의 작성</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl"> &times; </button>
        </div>

        <div className="p-8">
          <table className="w-full text-[14px] border-collapse">
            <tbody>
              <tr className="border-b border-gray-100">
                <th className="w-32 bg-[#F9F9FB] py-4 px-6 text-left font-medium text-gray-700">제목</th>
                <td className="py-3 px-4">
                  <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange}
                    placeholder="제목을 입력해주세요."
                    className="w-full border border-gray-200 rounded-sm px-3 py-2 outline-none focus:border-[#1D3C28]"
                  />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <th className="bg-[#F9F9FB] py-4 px-6 text-left font-medium text-gray-700">비밀글 설정</th>
                <td className="py-3 px-4">
                  <label className="flex items-center gap-2 cursor-pointer w-fit group">
                    <input 
                      type="checkbox" 
                      name="isSecret" // UI에서는 그대로 유지하되 로직에서 isPublic으로 변환
                      checked={!formData.isPublic} 
                      onChange={handleChange} 
                      className="w-4 h-4 accent-[#1D3C28]" 
                    />
                    <span className="text-gray-600 text-[13px] group-hover:text-[#1D3C28]">비밀글로 작성하기</span>
                  </label>
                </td>
              </tr>
              <tr>
                <th className="bg-[#F9F9FB] py-4 px-6 text-left font-medium text-gray-700 align-top pt-4">내용</th>
                <td className="py-3 px-4">
                  <textarea 
                    name="content" 
                    value={formData.content} 
                    onChange={handleChange} 
                    rows="10"
                    placeholder="내용을 상세히 입력해주세요."
                    className="w-full border border-gray-200 rounded-sm px-3 py-3 outline-none focus:border-[#1D3C28] resize-none"
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-8 py-5 bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} className="px-6 py-2 border border-gray-200 text-gray-600 rounded-sm text-[13px] hover:bg-white transition-colors"> 취소 </button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-[#1D3C28] text-white rounded-sm text-[13px] hover:bg-[#2d5a3c] transition-colors"> 등록하기 </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryAddModal;