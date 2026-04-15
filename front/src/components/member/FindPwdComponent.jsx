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
<div className="max-w-md mx-auto mt-20 mb-10 p-8 bg-white rounded-3xl shadow-2xl border border-green-50 relative overflow-hidden">
   
    <h2 className="text-3xl font-black mb-2 text-center text-green-700">비밀번호 찾기</h2>
    <p className="text-center text-gray-400 text-sm mb-8 font-medium">안전한 계정 복구를 도와드릴게요</p>

    {/* 단계 표시 (Step Indicator) - 노란색 포인트 */}
    <div className="flex justify-center gap-2 mb-10">
        {[1, 2, 3].map((num) => (
            <div 
                key={num}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step === num ? "bg-yellow-400 w-8" : "bg-gray-200"
                }`}
            />
        ))}
    </div>

    {step === 1 && (
        <div className="space-y-5 animate-fadeIn">
            <div className="relative">
                <input 
                    name="loginId"
                    value={info.loginId}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-gray-400"
                    placeholder="이메일 주소 입력"
                />
            </div>
            <button 
                disabled={isSubmitting} 
                className={`w-full p-4 rounded-2xl font-black text-white shadow-lg transition-all transform active:scale-95 ${
                    isSubmitting 
                    ? "bg-gray-300 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-700 hover:shadow-green-100"
                }`} 
                onClick={handleSendCode}
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        </svg>
                        발송 중...
                    </span>
                ) : "인증번호 받기"}
            </button>
        </div>
    )}

    {step === 2 && (
        <div className="space-y-5 animate-fadeIn">
            <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 mb-2">
                <p className="text-xs text-yellow-700 text-center font-bold">
                    입력하신 이메일로 인증번호 6자리를 보냈습니다.
                </p>
            </div>
            <input
                name="code"
                value={info.code}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all text-center text-2xl font-bold tracking-widest"
                placeholder="000000" 
                maxLength={6}
            />
            <button 
                className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl font-black shadow-lg transform active:scale-95 transition-all" 
                onClick={handleVerifyCode}
            >
                인증 확인
            </button>
            <p className="text-center text-xs text-gray-400">
                번호를 못 받으셨나요? <button className="text-green-600 underline font-bold" onClick={handleSendCode}>다시 보내기</button>
            </p>
        </div>
    )}

    {step === 3 && (
        <div className="space-y-5 animate-fadeIn">
            <div className="text-center mb-4">
            <p className="text-xs text-yellow-700 text-center font-bold"> 새로운 비밀번호를 입력해주세요.</p>
            </div>
            <input 
                type="password"
                name="nmpwd"
                value={info.nmpwd}
                onChange={handleChange}
                className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all"
                placeholder="새로운 비밀번호"
            />
            <button 
                className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl font-black shadow-lg transform active:scale-95 transition-all" 
                onClick={handleResetPwd}
            >
                비밀번호 변경 완료
            </button>
        </div>
    )}
</div>
    )



}
export default FindPwdComponent














