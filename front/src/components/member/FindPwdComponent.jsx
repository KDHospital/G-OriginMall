import { useState } from "react";
import { sendEmailCode,verifyEmailCode,resetPassword } from "../../api/memberApi";
import {useNavigate} from "react-router-dom"

const initState = {
    loginId : "",
    code: "",
    nmpwd:""
}

const FindPwdComponent= () => {

    const [info, setInfo] = useState({...initState})
    const [step, setStep] = useState(1) // 단계 제어는 별도 상태로 관리
    const navigate = useNavigate()


    const handleChange = (e) => {
        setInfo({...info, [e.target.name]:e.target.value})
    }

    const handleSendCode = () => {
        if(!info.loginId) return alert("이메일을 입력해주세요")
            sendEmailCode(info.loginId)
        .then( ()=> {
            alert("인증번호가 발송되었습니다")
            setStep(2)
        })
        .catch( ()=> alert("존재하지 않는 이메일이거나 발송에 실패했습니다."))
    }

    const handleVerifyCode = () => {
        verifyEmailCode(info.loginId , info.nmpwd)
        .then( ()=> {
            alert("인증 성공! 새 비밀번호를 설정하세요.")
            setStep(3)
        })
        .catch(()=> alert("인증번호가 일치하지 않습니다."))
    }

    const handleResetPwd = () => {
        if(info.nmpwd.length < 8) return alert("비밀번호는 8자 이상잉어야 합니다.")

            resetPassword({loginId:info.loginId , nmpwd: info.nmpwd})
            .then(()=> {
                alert("비밀번호가 변경되었습니다. 다시 로그인해주세요")
                navigate("/member/login")
            })
            .catch(err => alert(err.response?.data?.message || "변경실패"))
    }

    return(
<div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black mb-8 text-center text-green-700">비밀번호 찾기</h2>

        {step === 1 && (
            <div className="space-y-4">
                <input 
                name="loginId"
                value={info.loginId}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl"
                placeholder="이메일 입력"/>
                <button className="w-full bg-green-600 text-white p-4 rounded-xl font-bold" onClick={handleSendCode}>인증번호 받기</button>

            </div>
        )}

        {step === 2 && (
            <div className="space-y-4">
                <input
                name="code"
                value={info.code}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl"
                placeholder="인증번호 6자리" />
                <button className="w-full bg-green-600 text-white p-4 rounded-xl font-bold" onClick={handleVerifyCode}>인증하기</button>

            </div>
        )}

        {step === 3 && (
            <div className="space-y-4">
                <input 
                type="password"
                name="nmpwd"
                value={info.nmpwd}
                onChange={handleChange}
                className="w-full p-4 border ronuded-xl"
                placeholder="새 비밀번호 입력"/>
                <button className="w-full bg-green-600 text-white p-4 rounded-xl font-bold" onClick={handleResetPwd}>변경완료</button>


            </div>
        )}

</div>
    )



}
export default FindPwdComponent














