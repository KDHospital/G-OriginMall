import { useState } from "react";
import { login } from "../../api/memberApi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { KAKAO_AUTH_URL } from "../../api/kakaoApi";
import { getNaverAuthUrl } from "../../api/naverAPI";

const initState = {
    loginId:'',
    mpwd:''
}

const LoginComponent = () => {
    const [loginParam, setLoginParam] = useState({...initState})
    const navigate = useNavigate()

    const handleChange = (e) => {
        const {name,value} = e.target
        loginParam[e.target.name] = e.target.value
        setLoginParam({...loginParam})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        handleClickLogin()

    }

    const handleClickLogin = () => {
        if(!loginParam.loginId || !loginParam.mpwd) {
            return alert("아이디와 비밀번호 모두 입력해주세요")
        }

        login(loginParam)
        .then( (data) => {
            console.log("로그인 성공:", data)
            const memberObj = {
            id: data.memberId,  
            loginId: data.loginId,
            mname: data.mname,
            role: Number(data.role), 
            businessVerified: data.businessVerified,
            result: data.result,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
    }
    
            localStorage.setItem("member",JSON.stringify(memberObj))

            if(data.refreshToken || data.accessToken){
                axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.refreshToken || data.accessToken}`
            }

            alert("로그인에 성공했습니다.")
            window.location.href = "/"
        })
        .catch( err => {
           const errorMsg = err.response?.data ||"아이디 또는 비밀번호를 확인해주세요."
           alert(errorMsg)
           console.error("로그인 에러:",errorMsg)
        })
    }

    return(
        <div className="max-w-md mx-auto mt-20 mb-10 p-8 bg-white rounded-3xl shadow-2xl border border-green-50 relative overflow-hidden">

    <div className="text-3xl mb-10 font-black text-green-700 text-center tracking-tight">로그인</div>

    <form className="space-y-6" onSubmit={handleSubmit}>
        
        <div className="space-y-2">
            <label className="text-sm font-black text-gray-600 ml-1">아이디(이메일)</label>
            <input 
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-gray-300"
                name="loginId"
                type="text"
                value={loginParam.loginId}
                onChange={handleChange}
                placeholder="example@email.com" 
            />
        </div>

        
        <div className="space-y-2">
            <label className="text-sm font-black text-gray-600 ml-1">비밀번호</label>
            <input 
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-gray-300"
                name="mpwd"
                type="password"
                value={loginParam.mpwd}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
            />
        </div>

        
        <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl font-black text-xl shadow-lg shadow-green-100 transition-all transform active:scale-95 mt-2"
        >
            로그인
        </button>

       
        <div className="flex flex-col items-center gap-3 pt-2">
            <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="cursor-pointer hover:text-green-600 font-bold transition-colors" onClick={() => navigate("/findid")}>아이디 찾기</span>
                <span className="text-gray-200">|</span>
                <span className="cursor-pointer hover:text-green-600 font-bold transition-colors" onClick={() => navigate("/findpwd")}>비밀번호 찾기</span>
            </div>
            
            <div className="text-sm text-gray-500">
                계정이 없으신가요?{" "}
                <span
                    className="text-yellow-600 font-black cursor-pointer hover:text-yellow-700 transition-colors underline underline-offset-4"
                    onClick={() => navigate("/signup")}
                >
                    회원가입 하러가기
                </span>
            </div>
        </div>

        
        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-green-600 font-bold">소셜 로그인</span>
            </div>
        </div>

        
        <div className="space-y-3 px-2">
            <a href={KAKAO_AUTH_URL} className="block transition-transform active:scale-95">
                <img 
                    src="/assets/images/kakao_login_large_wide.png" 
                    alt="카카오 로그인" 
                    className="w-full h-auto rounded-xl shadow-sm hover:shadow-md transition-shadow" 
                />
            </a>
            <a href={getNaverAuthUrl()} className="block transition-transform active:scale-95">
                <img 
                    src="/assets/images/NAVER_login_Light_KR_green_wide_H56.png" 
                    alt="네이버 로그인" 
                    className="w-full h-auto rounded-xl shadow-sm hover:shadow-md transition-shadow" 
                />
            </a>
        </div>
    </form>
</div>
    )



}
export default LoginComponent












