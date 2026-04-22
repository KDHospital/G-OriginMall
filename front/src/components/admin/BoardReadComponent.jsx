import React, { useEffect, useState } from "react";
import { getAdminBoardOne, adminRemovePost, addAnswer } from '../../api/boardApi';
import { isInquiryBoard } from '../../util/boardConstants';

const BoardReadComponent = ({ postId, onMoveToList, onMoveToModify }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);

  // 답변 관련 상태
  const [answerText, setAnswerText] = useState('');
  const [answerLoading, setAnswerLoading] = useState(false);
  const [isEditingAnswer, setIsEditingAnswer] = useState(false);

  // 게시글 로드
  const loadPost = () => {
    if (!postId) return;
    setLoading(true);
    getAdminBoardOne(postId)
      .then(data => {
        setPost(data);
        setIsEditingAnswer(false);
        setAnswerText('');
      })
      .catch(err => console.error("상세조회 실패:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPost(); }, [postId]);

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!window.confirm("이 게시글을 삭제하시겠습니까?")) return;
    try {
      await adminRemovePost(postId);
      alert("삭제되었습니다.");
      onMoveToList();
    } catch (error) {
      alert("삭제에 실패했습니다.");
    }
  };

  // 답변 등록/수정 핸들러
  const handleAnswerSubmit = async () => {
    if (!answerText.trim()) return alert("답변 내용을 입력해주세요.");
    setAnswerLoading(true);
    try {
      await addAnswer(postId, answerText.trim());
      const hadAnswer = post.answers && post.answers.length > 0;
      alert(hadAnswer ? "답변이 수정되었습니다." : "답변이 등록되었습니다.");
      loadPost();
    } catch (error) {
      console.error("답변 처리 실패:", error.response?.status, error.response?.data);
      alert("답변 처리에 실패했습니다. (" + (error.response?.status || "네트워크 오류") + ")");
    } finally {
      setAnswerLoading(false);
    }
  };

  // 답변 수정 시작
  const startEditAnswer = () => {
    if (post.answers && post.answers.length > 0) {
      setAnswerText(post.answers[post.answers.length - 1].content);
    }
    setIsEditingAnswer(true);
  };

  // 답변 수정 취소
  const cancelEditAnswer = () => {
    setIsEditingAnswer(false);
    setAnswerText('');
  };

  // 로딩/에러 상태
  if (loading) return <div className="py-24 text-center text-gray-400">데이터를 불러오는 중입니다...</div>;
  if (!post) return <div className="py-24 text-center text-gray-400">게시글을 찾을 수 없습니다.</div>;

  const isInquiry = isInquiryBoard(post.boardId);
  const hasAnswer = post.answers && post.answers.length > 0;

  // 공통 스타일
  const btnDanger = "px-5 py-2.5 text-sm font-semibold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors";
  const btnPrimary = "px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors";
  const btnSecondary = "px-5 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors";

  // 뱃지 스타일
  const badge = (condition, trueStyle, falseStyle, trueLabel, falseLabel) => (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${condition ? trueStyle : falseStyle}`}>
      {condition ? trueLabel : falseLabel}
    </span>
  );

  return (
    <div className="space-y-5">

      {/* 페이지 헤더 */}
      <div className="flex justify-between items-end">
        <div>
          <button
            onClick={onMoveToList}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-1 flex items-center gap-1"
          >
            <span>←</span> 목록으로
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {isInquiry ? '고객문의' : '공지사항'} 상세
          </h2>
        </div>
        <div className="flex gap-2">
          <button onClick={handleDelete} className={btnDanger}>삭제</button>
          {!isInquiry && (
            <button onClick={() => onMoveToModify(postId)} className={btnPrimary}>수정</button>
          )}
        </div>
      </div>

      {/* 게시글 카드 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

        {/* 메타 정보 */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5 mb-3">
            {badge(post.isPublic, 'bg-blue-50 text-blue-600', 'bg-gray-100 text-gray-500', '공개', '비공개')}
            {isInquiry && badge(hasAnswer, 'bg-emerald-50 text-emerald-600', 'bg-amber-50 text-amber-600', '답변완료', '답변대기')}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {post.title}
          </h3>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>{post.mName || '관리자'}</span>
            <span>{post.createdAt?.split('T')[0]}</span>
            <span>조회 {post.viewCount || 0}</span>
          </div>
        </div>

        {/* 본문 */}
        <div className="px-6 py-6 min-h-[200px] text-sm text-gray-700 leading-7 whitespace-pre-wrap">
          {post.content}
        </div>
      </div>

      {/* 답변 영역 (문의글인 경우) */}
      {isInquiry && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

          {/* 답변 헤더 */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h4 className="font-bold text-gray-800 flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                A
              </span>
              관리자 답변
            </h4>
            {hasAnswer && !isEditingAnswer && (
              <button
                onClick={startEditAnswer}
                className="px-4 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                답변 수정
              </button>
            )}
          </div>

          {/* 기존 답변 목록 (수정 모드가 아닐 때) */}
          {hasAnswer && !isEditingAnswer && (
            <div className="px-6 py-5 space-y-0 divide-y divide-gray-100">
              {post.answers.map((answer, idx) => (
                <div
                  key={answer.answerId || idx}
                  className={`${idx > 0 ? 'pt-4' : ''} ${idx < post.answers.length - 1 ? 'pb-4' : ''}`}
                >
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {answer.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    {answer.createdAt?.replace('T', ' ').slice(0, 16)} 등록
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* 답변 입력/수정 폼 */}
          {(!hasAnswer || isEditingAnswer) && (
            <div className="px-6 py-5">
              {!hasAnswer && (
                <p className="text-sm text-gray-400 mb-3">
                  아직 등록된 답변이 없습니다. 아래에 답변을 작성해 주세요.
                </p>
              )}
              <textarea
                className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 outline-none text-sm leading-relaxed placeholder-gray-300 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all resize-y"
                placeholder="답변 내용을 입력하세요..."
                rows={5}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-3">
                {isEditingAnswer && (
                  <button onClick={cancelEditAnswer} className={btnSecondary}>
                    취소
                  </button>
                )}
                <button
                  onClick={handleAnswerSubmit}
                  disabled={answerLoading}
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {answerLoading ? '처리 중...' : (hasAnswer ? '답변 수정' : '답변 등록')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BoardReadComponent;
