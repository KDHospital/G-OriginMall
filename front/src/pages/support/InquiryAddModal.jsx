import React, { useState } from 'react';
import { addInquiry } from '../../api/boardApi';

const InquiryAddModal = ({ isOpen, onClose, onRefresh }) => {
  // 1. 폼 초기 상태 (로그인 정보 체크 로직 제거)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublic: true // 기본값 공개글
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
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

// 등록 제출 핸들러
  const handleSubmit = async () => {
    // 1. 필수 입력값 체크 (기획적으로 꼭 필요한 유효성 검사)
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      // 2. [데이터 정리 핵심] 서버가 요청 헤더의 쿠키를 보고 작성자를 판단

      const sendData = {
        title: formData.title,
        content: formData.content,
        isPublic: formData.isPublic,
        boardId: 2, // 고객문의 게시판 ID (백엔드와 약속된 값)
        viewCount: 0
      };

      // api 호출 (withCredentials: true 설정이 되어있는 함수)
      await addInquiry(sendData); 
      
      alert("문의사항이 성공적으로 등록되었습니다.");
      
      onRefresh(); 
      onClose();   
      setFormData({ title: '', content: '', isPublic: true });
    } catch (error) {
      console.error("등록 실패:", error);
      if (error.response?.status === 401) {
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        alert("등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* 헤더 영역 */}
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-[20px] font-bold text-[#1D3C28]">고객문의 작성</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl"> &times; </button>
        </div>

        {/* 본문 영역 (테이블 레이아웃) */}
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
                      name="isSecret" 
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

        {/* 하단 버튼 영역 */}
        <div className="px-8 py-5 bg-gray-50 flex justify-end gap-2">
          <button 
            onClick={onClose} 
            disabled={loading}
            className="px-6 py-2 border border-gray-200 text-gray-600 rounded-sm text-[13px] hover:bg-white transition-colors"
          >
            취소
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="px-6 py-2 bg-[#1D3C28] text-white rounded-sm text-[13px] hover:bg-[#2d5a3c] transition-colors flex items-center justify-center min-w-[80px]"
          >
            {loading ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryAddModal;