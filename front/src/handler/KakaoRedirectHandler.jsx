import React, {use, useEffect} from "react";
import { useNavigate,useSearchParams } from "react-router-dom";
import { getKakaoLoginMessage } from "../api/kakaoApi"; 




const KakaoRedirectHandler = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const code = searchParams.get("code")


    useEffect( ()=>{
        if(code){ 
            //백엔드 인가코드 전달
            getKakaoLoginMessage(code)
            .then((data) => {
                console.log("로그인 성공 데이터:",data)

                //로그인 정보 저장
                localStorage.setItem("member", JSON.stringify(data))

                //추가 정보 입력 필요 여부 확인
                if (data.needsExtraInfo) {
                    alert("가입을 환영합니다! 정확한 서비스 이용을 위해 추가 정보를 입력해주세요.")
                    navigate("/modifypage")
                } else {
                    alert(`${data.mname}님 환영합니다!`)
                    navigate("/")  
                 }
            })
            .catch((err) => {
                console.error("로그인 처리 중 에러:", err)
                alert("로그인에 실패했습니다. 다시 시도해주세요")
                navigate("/login")
            })
        }
    },[code, navigate])

    return(
        <div className="flex justify-center items-center h-screen">
            <p className="text-xl font-semibold">카카오 로그인 처리 중입니다...</p>
        </div>
    )
}
export default KakaoRedirectHandler