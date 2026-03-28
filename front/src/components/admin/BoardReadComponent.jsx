import React, {useEffect, useState} from "react";

// 초기 데이터 구조 (백엔드 PostResponseDTO와 매칭)
const initState = {
  id: 0,
  title: '',
  content: '',
  writer: '',
  createdAt: '',
  boardId: 0
};

const BoardReadComponent = ({postId, onMoveToList, onMoveToModify}) => {
    const [post, setPost] = useState(initState);
    const [loading, setLoading] = useState(false);

    useEffect( ()=> {
        setLoading(true);
    console.log(`${postId}번 게시글 상세 조회를 시작합니다.`);
        
        // API 연동 예시: getOne(postId).then(data => setPost(data));
        // 현재는 ERROR_ACCESS_TOKEN 이슈를 고려하여 로직만 배치합니다.
        setLoading(false);
    }, [postId]);

    if (loading) return <div style={{ padding: '20px' }}>데이터를 불러오는 중입니다...</div>;
    
    return(
        <div className="p-4 w-full bg-white">
            <div className="text-3xl font-extrabold" >
                    BoardReadComponent
            </div>
        </div>
        
    )

    

}
export default BoardReadComponent;