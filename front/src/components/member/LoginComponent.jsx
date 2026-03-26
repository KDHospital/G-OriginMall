import { useState } from "react";
import { login } from "../../api/memberApi";
import { useNavigate } from "react-router-dom";

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

            localStorage.setItem("member",JSON.stringify(data))

            alert("로그인에 성공했습니다.")
            navigate("/")
        })
        .catch( (err) => {
            console.error(err)
            alert("로그인 실패: 아이디나 비밀번호를 확인하세요")
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
        </form>
        </div>
    )



}
export default LoginComponent












