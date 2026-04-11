import { useState } from "react";
import { login } from "../../api/memberApi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { KAKAO_AUTH_URL } from "../../api/kakaoApi";

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
        role: data.role,
        mname: data.mname,
        memberId: data.memberId,
        result: data.result
    }
    
            localStorage.setItem("member",JSON.stringify(data))

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
        <div className="max-w-md mx-auto border-2 border-green-200 mt-20 p-8 bg-white shadow-lg rounded-lg">
            <div className="text-3xl mb-8 font-extrabold text-green-600 text-center">로그인</div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label className="font-bold mb-1 block text-gray-700">아이디(이메일)</label>
            <input 
            className="w-full p-3 border border-gray-300 rounded focus:outline-green-500"
            name="loginId"
            type="text"
            value={loginParam.loginId}
            onChange={handleChange}
            placeholder="example@email.com" />
            </div>
            <div>
                <label className="font-bold mb-1 block text-gray-700">비밀번호</label>
                <input 
                className="w-full p-3 border border-gray-300 rounded focus:outline-green-500"
                name="mpwd"
                type="password"
                value={loginParam.mpwd}
                onChange={handleChange}
                placeholder="비밀번호 입력"/>
            </div>

            <button
            type="submit"
            className="w-full bg-green-600 text-wrap p-4 rounded font-extrabold text-xl shadow-md hover:bg-green-700 transition-all"
            >로그인</button>

            <div className="text-center text-sm text-gray-500 mt-4">
                계정이 없으신가요?{" "}
                <span
                className="text-green-600 font-bold cursor-pointer hover:underline"
                onClick={() =>navigate("/signup")}>
                    회원가입 하러가기
                </span>
            </div>
            <div className="flex justify-center items-center gap-4 mt-4 text-sm text-gray-400">
             <span
                className="text-gray-600 font-bold cursor-pointer hover:underline"
                onClick={() => navigate("/findid")}>
                    아이디 찾기
                </span>
                <span className="text-gray-300">|</span>
                <span
                className="text-gray-600 font-bold cursor-pointer hover:underline"
                onClick={() => navigate("/findpwd")}>
                     비밀번호 찾기
                </span>
            </div>
            <div className="space-y-4">
                <div className="text-center text-sm text-green-600 font-bold">소셜 로그인</div>
                <div className="flex justify-center">
                    <a href={KAKAO_AUTH_URL} className="hover:opacity-90 transition-opacity">
                        <img 
                             src="\public\assets\images\kakao_login_large_wide.png"
                              alt="카카오 로그인" 
                              className="shadow-sm rounded" />
                    </a>

                </div>
            </div>
        </form>
        </div>
    )



}
export default LoginComponent












