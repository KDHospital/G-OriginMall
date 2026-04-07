import { useState ,useEffect } from "react";
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
    const [isCodeSent, setIsCodeSent] = useState(false)
    const [timeLeft, setTimeLeft] = useState(180);
    const [isVerified,setIsVerified] = useState(false) 
    const [isSubmitting, setIsSubmitting] = useState(false)


    useEffect (() => {
        let timer;
        if (isCodeSent && !isVerified && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev -1)
            },1000)
        } else if ( timeLeft ===0) {
            alert("인증 시간이 만료되었습니다. 다시 시도해주세요.")
            setIsCodeSent(false)
            setTimeLeft(180)
        }
        return() => clearInterval(timer)
    },[isCodeSent, isVerified , timeLeft])
    
    
    const handleChange = (e) => {
        setInfo({...info, [e.target.name]:e.target.value})
    }

    const handleSendCode = () => {
        if(!info.loginId) return alert("이메일을 입력해주세요")
            
            setIsSubmitting(true)
            
            sendEmailCode({ email: info.loginId, type : "PWD" })
        .then( ()=> {
            alert("인증번호가 발송되었습니다")
            setIsCodeSent(true)
            setStep(2)
        })
        .catch( ()=> alert("존재하지 않는 이메일이거나 발송에 실패했습니다."))
        .finally(() => {
            setTimeout(() => setIsSubmitting(false),3000)
        })
    }

    const handleVerifyCode = () => {
        verifyEmailCode(info.loginId , info.code)
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
                navigate("/login")
            })
            .catch(err => alert(err.response?.data?.message || "변경실패"))
    }

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return`${m}: %{s < 10 ? "0" : ""}${s}`
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
                <button disabled={isSubmitting} className={`w-full p-4 rounded-xl font-bold text-white transition-colors ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`} onClick={handleSendCode}>
                {isSubmitting ? "발송중..." : "인증번호 받기"}</button>

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














