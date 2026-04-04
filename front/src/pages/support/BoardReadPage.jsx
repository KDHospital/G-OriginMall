import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BasicLayout from '../../layouts/BasicLayout';
import UserSupportComponent from '../../components/support/UserSupportComponent';
import { getBoardOne } from '../../api/boardApi'; 

const BoardReadPage = () => {
  const { postId } = useParams(); 
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    getBoardOne(postId)
      .then(data => setPost(data))
      .catch(err => console.error("상세조회 실패:", err))
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) return <BasicLayout><div className="text-center py-20 font-light text-gray-400 text-[13px]">데이터를 불러오는 중입니다...</div></BasicLayout>;
  if (!post) return <BasicLayout><div className="text-center py-20 text-gray-400 text-[13px]">게시글을 찾을 수 없습니다.</div></BasicLayout>;

  return (
    <BasicLayout>
      <UserSupportComponent title="공지사항" description="지오리진 몰의 새로운 소식을 전해드립니다.">
        <div className="w-full text-gray-700">
          
          {/* 상단 헤더 영역: 전체 높이를 확보하고 수직 중앙 정렬 수행 */}
          <div className="border-t-2 border-gray-800 border-b border-gray-100 mb-8 flex flex-col justify-center min-h-[110px]">
            
            {/* 💡 제목: h-full과 flex items-center를 통해 세로 가운데 정렬 */}
            <div className="flex items-center pt-1">
              <h1 className="text-xl font-bold text-[#1a2b3c] tracking-tight leading-tight">
                {post.title}
              </h1>
            </div>
            
            {/* 💡 부가 정보: 제목과 조화를 이루며 세로 기준으로 정돈 */}
            <div className="flex justify-between items-center text-[#999999] font-light text-xs mt-2 pb-1">
              <div className="flex gap-3 items-center">
                <span>작성일: {post.createdAt ? post.createdAt.split('T')[0] : '-'}</span>
                <span className="text-gray-200">|</span>
                <span>작성자: {post.member?.name || post.member?.nickname || '관리자'}</span>
              </div>
              <div className="font-light text-[11px]">조회수: {post.viewCount || 0}</div>
            </div>
          </div>

          {/* 💡 콘텐츠 영역: 텍스트 위 여백을 줄여 제목 영역과 밀착 */}
          <div className="min-h-[300px] text-[13px] text-gray-600 leading-7 mb-10 px-1 whitespace-pre-wrap mt-0">
            {post.content}
          </div>

          {/* 하단 버튼 영역 */}
          <div className="flex justify-center border-t border-gray-100 pt-8 pb-20">
            <button
              onClick={() => navigate('/board')}
              className="px-10 py-2 border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all font-light text-[13px] rounded-sm"
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