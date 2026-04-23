import React, { useState } from 'react';
import { addInquiry } from '../../api/boardApi';
import useAuth from '../../hooks/useAuth';
import { BOARD_QNA } from '../../util/boardConstants';

const InquiryAddModal = ({ isOpen, onClose, onRefresh }) => {
  const { isLoggedIn } = useAuth();
  // 1. 폼 초기 상태: 기본값을 공개글(isPublic: true)로 설정
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublic: true 
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (name === "isSecret") {
      // '비밀글로 작성하기' 체크박스 로직
      // 체크됨(true) -> 비밀글이므로 isPublic은 false
      // 체크해제(false) -> 공개글이므로 isPublic은 true
      setFormData({
        ...formData,
        isPublic: !checked 
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
    // 비로그인 사용자 차단 (서버 호출 전 안내)
    if (!isLoggedIn) {
      alert("고객문의는 회원가입 후 등록이 가능합니다.");
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      // 백엔드 DTO 규격에 맞춘 데이터 전송
      const sendData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        isPublic: formData.isPublic,
        boardId: BOARD_QNA
      };

      await addInquiry(sendData);

      alert("문의사항이 성공적으로 등록되었습니다.");

      // 상태 초기화 및 닫기
      onRefresh();
      onClose();
      setFormData({ title: '', content: '', isPublic: true }); // 다시 기본값 공개로 초기화
    } catch (error) {
      console.error("등록 실패:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("고객문의는 회원가입 후 등록이 가능합니다.");
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
        
        {/* 헤더 */}
        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-baseline gap-3">
            <h2 className="text-[20px] font-bold text-[#1D3C28]">고객문의 작성</h2>
            <span className="text-[12px] text-gray-500 font-normal">
              ※ 고객문의는 회원가입 후 등록이 가능합니다.
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"> &times; </button>
        </div>

        {/* 본문 (기존 테이블 레이아웃) */}
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
                      // 기본이 공개글이므로, 초기값에서는 체크가 해제되어야 함
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

        {/* 하단 버튼 */}
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
            className="px-6 py-2 bg-[#1D3C28] text-white rounded-sm text-[13px] hover:bg-[#2d5a3c] transition-colors min-w-[100px]"
          >
            {loading ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryAddModal;