import React,{useEffect} from "react";
import { useSearchParams , useNavigate } from "react-router-dom";
import { getNaverLoginMessage } from "../api/naverAPI";


const NaverRedirectHandler = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const code = searchParams.get("code")
    const state = searchParams.get("state")

    useEffect(() =>{
        if (code && state) {
            //백엔드에 인가코드와 state전달
            getNaverLoginMessage(code,state).then((data)=>{
                console.log("네이버 로그인 성공 데이터:",data)
                //로그인 데이터 처리
                localStorage.setItem("member",JSON.stringify(data))

                //추가 정보 입력 여부에 따른 페이지 이동
                if(data.needsExtraInfo){
                    alert("추기 정보 입력이 필요합니다.")
                    navigate("/modifypage")
                }else{
                    alert("로그인에 성공했습니다.")
                    navigate("/")
                }
            }).catch(err => {
                console.error("로그인 처리 에러:",err)
                alert("로그 처리 중 오류가 발생했습니다.")
                navigate("/login")
            })
        }
    },[code, state])

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-xl font-bold">네이버 로그인 처리 중입니다.....</div>
        </div>
    )
}
export default NaverRedirectHandler