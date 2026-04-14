import { useEffect, useState } from "react";
import { sendEmailCode , verifyEmailCode , userSignup } from "../../api/memberApi";
import { useNavigate } from "react-router-dom"
const initState = {
    loginId:'',
    mpwd:'',
    mpwdConfirm:'',
    mname:'',
    tel:'',
    gender: 0
}

const SignupComponent = () =>{
  const [form, setform] = useState({...initState})
  const [vCode,setVCode] = useState("")
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isVerified,setIsVerified] = useState(false)
  const [pwdError, setPwdError] = useState(false)
  const navigate = useNavigate() 
  const [isSending, setIsSending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180);

useEffect(() => {
    let timer;
    if (isCodeSent && !isVerified && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      alert("인증 시간이 만료되었습니다. 다시 시도해주세요.");
      setIsCodeSent(false);
      setTimeLeft(180);
    }
    return () => clearInterval(timer);
  }, [isCodeSent, isVerified, timeLeft]);

  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

    useEffect( () => {

        if(form.mpwdConfirm && form.mpwd !== form.mpwdConfirm){
            setPwdError(true)
        } else{
            setPwdError(false)
        }
    }, [form.mpwd, form.mpwdConfirm])

  //입력값 변경 핸들러
  const handleChange = (e) => {
    const {name,value} = e.target
    setform({...form,[name]:name === 'gender' ? parseInt(value) : value})
  }

  //이메일 인증코드 발송
  const handleSendCode = () => {
    if(!form.loginId) return alert("이메일을 입력해주세요")
       
        setIsSending(true)
        sendEmailCode({email: form.loginId, type:"JOIN"}).then( ()=>{
        setIsCodeSent(true)
        setTimeLeft(180);
        alert("인증코드가 전송되었습니다")
    }).catch( (err)=> {
        const msg = err.response?.data?.message || "발송 실패!"
        alert(msg)
    })
    .finally(()=>{
        setIsSending(false)
    })
  }

  //인증코드 확인
  const handleVerifyCode= () => {
    verifyEmailCode(form.loginId, vCode).then(() => {
        setIsVerified(true)
        alert("이메일 인증이 완료되었습니다.")
    }).catch( ()=> alert("코드가 일치하지 않습니다."))
  }
  //최종 회원가입 버튼 클릭
  const handleClickSignup = () => {
    if(!isVerified) return alert("이메일 인증을 먼저 완료해주세요")
    if(pwdError) return alert("비밀번호가 일치하지 않습니다.")
    if(!form.mpwd) return alert("비밀번호를 입력해주세요")
    
    const {mpwdConfirm, ...sendDate} = form

    const finalData = {
        ...sendDate,
        tel:sendDate.tel.replace(/-/g,""),
        verificationCode: vCode,
        emailVerified : true
    }
 
  userSignup( finalData)
    .then(() => {
        alert("회원가입이 완료되었습니다.")
        navigate("/login")
    })
    .catch( err => {
        const data = err.response?.data
        if(data?.errors){
            alert(data.errors[0].defaultMessage)
        }else if(data?.message) {
            alert(data.message)
        }else {
            alert("회원가입 중 오류가 발생했습니다.")
        }
    })

    
  }
  //연락처 전용 자동 하이픈 핸들러
  const handleTelChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g,'')
    let formattedNumber = ''
    if(value.length <=3){
        formattedNumber = value
    }else if(value.length <= 7) {
        formattedNumber = `${value.slice(0,3)}-${value.slice(3)}`
    }else{
        formattedNumber = `${value.slice(0,3)}-${value.slice(3,7)}-${value.slice(7,11)}`
    }
    setform({
        ...form,
        tel: formattedNumber
    })
  }


    return (
    <div className="max-w-lg mx-auto border-2 border-green-200 mt-10 p-8 bg-white shadow-lg rounded-lg">
      
        <div className="text-3xl mb-8 font-extrabold text-green-600 text-center">회원가입</div>
        
        <div className="space-y-6">
            {/*아이디 (이메일) 섹션 */}
            <div>
                <label className="font-bold mb-1 block text-gray-700">아이디 (이메일)</label>
                <div className="flex gap-2">
                    <input
                        className="flex-1 p-3 border border-gray-300 rounded focus:outline-green-500"
                        name="loginId"
                        value={form.loginId}
                        onChange={handleChange}
                        disabled={isVerified || isSending}
                        placeholder="example@email.com"
                    />
                    <button className={`px-4 rounded text-sm font-bold transition shadow-sm ${
                        (isVerified || isSending)
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-yellow-400 hover:bg-yellow-500 text-yellow-900" 
                    }`}
                    onClick={handleSendCode}
                    disabled={isVerified || isSending}>
                        {isSending ? "발송중..." : isCodeSent ? "재전송" : "인증받기"}
                    </button>
                </div>

                {/*인증코드 입력창 */}
                {isCodeSent && !isVerified && (
                    <div className="mt-2 p-4 bg-yellow-50 border border-yellow-200 rounded"> 
                        <div className="flex gap-2 relative">
                            <div className="flex-1 relative">
                                <input
                                    className="w-full p-3 border border-yellow-300 rounded focus:outline-yellow-500 bg-white"
                                    placeholder="인증코드 6자리 입력"
                                    value={vCode}
                                    onChange={(e) => setVCode(e.target.value)}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-red-500">
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                            <button
                                className="bg-green-500 text-white px-6 rounded font-bold hover:bg-green-600 shadow-sm"
                                onClick={handleVerifyCode}
                            >
                                확인
                            </button>
                        </div>
                        <p className="text-xs text-amber-600 mt-2 ml-1 font-medium">* 3분 이내에 코드를 입력해주세요.</p>
                    </div>
                )}
                {isVerified && <p className="text-green-600 text-sm mt-1 font-bold ml-1 flex items-center gap-1">✓ 인증완료</p>}
            </div>

            {/*비밀번호 섹션 */}
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col">
                    <label className="font-bold mb-1 text-gray-700 text-sm">비밀번호</label>
                    <input 
                        className={`p-3 border rounded focus:outline-none ${pwdError ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-green-500'}`}
                        name="mpwd" type="password" value={form.mpwd} onChange={handleChange} placeholder="비밀번호 입력"
                    />
                </div>
               
                <div className="flex flex-col">
                    <label className="font-bold mb-1 text-gray-700 text-sm">비밀번호 확인</label>
                    <input 
                        className={`p-3 border rounded focus:outline-none ${pwdError ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-300 focus:border-green-500'}`}
                        name="mpwdConfirm" type="password" value={form.mpwdConfirm} onChange={handleChange} placeholder="비밀번호 다시 입력"
                    />
                    {pwdError && <span className="text-red-500 text-xs mt-1 ml-1 font-bold">✕ 비밀번호가 일치하지 않습니다.</span>}
                    {!pwdError && form.mpwdConfirm && <span className="text-green-600 text-xs mt-1 ml-1 font-bold">✓ 비밀번호가 일치합니다.</span>}
                </div>
            </div>

            {/*이름 및 연락처 섹션 */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label className="font-bold mb-1 text-gray-700 text-sm">이름</label>
                    <input className="p-3 border border-gray-300 rounded focus:border-green-500 outline-none" name="mname" value={form.mname} onChange={handleChange} placeholder="성함 입력"/>
                </div>
                <div className="flex flex-col">
                    <label className="font-bold mb-1 text-gray-700 text-sm">연락처</label>
                    <input className="p-3 border border-gray-300 rounded focus:border-green-500 outline-none" name="tel" value={form.tel} placeholder="010-0000-0000" maxLength="13" onChange={handleTelChange} />
                </div>
            </div>

            {/* 성별 섹션 */}
            <div>
                <label className="font-bold mb-1 block text-gray-700 text-sm">성별</label>
                <div className="flex gap-4 p-3 bg-gray-50 rounded border border-gray-200 justify-around">
                    <label className="text-sm cursor-pointer flex items-center gap-2">
                        <input type="radio" name="gender" value="0" checked={Number(form.gender) === 0} onChange={handleChange} className="accent-green-600" /> 미지정
                    </label>
                    <label className="text-sm cursor-pointer flex items-center gap-2">
                        <input type="radio" name="gender" value="1" checked={Number(form.gender) === 1} onChange={handleChange} className="accent-green-600" /> 남성
                    </label>
                    <label className="text-sm cursor-pointer flex items-center gap-2">
                        <input type="radio" name="gender" value="2" checked={Number(form.gender) === 2} onChange={handleChange} className="accent-green-600" /> 여성
                    </label>
                </div>
            </div>

            {/* 가입하기 버튼 */}
            <button 
                className={`w-full p-4 rounded text-white font-extrabold text-xl shadow-md transition-all active:scale-[0.98]
                    ${(isVerified && !pwdError && form.mpwd) ? 'bg-green-600 hover:bg-green-700 shadow-green-100' : 'bg-gray-300 cursor-not-allowed'}`}
                disabled={!isVerified || pwdError || !form.mpwd}
                onClick={handleClickSignup}
            >
                가입하기
            </button>
        </div>
    </div>
)
}
export default SignupComponent
