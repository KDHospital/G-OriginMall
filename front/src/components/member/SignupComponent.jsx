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
    sendEmailCode(form.loginId).then( ()=>{
        setIsCodeSent(true)
        alert("인증코드가 전송되었습니다")
    }).catch( ()=> alert("발송 실패"))
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
        verificationCode: vCode,
        emailVerified : true
    }
 
  userSignup( finalData)
    .then(() => {
        alert("회원가입이 완료되었습니다.")
        navigate("/login")
    })
    .catch( (err) => {
        const msg = err.response?.data || "가입 실패: 정보를 다시 확인해주세요"
        alert(msg)
    })
  }


    return(
        <div className="max-w-lg mx-auto border-2 border-green-200 mt-10 p-8 bg-white shadow-lg rounded-lg ">
            <div className="text-3xl mb-8 font-extrabold text-green-600 text-center">회원가입</div>
            <div className="space-y-6">
                <div>
                    <label className="font-bold mb-1 block text-gray-700">아이디 (이메일)</label>
                    <div className="flex gap-2">
                        <input
                        className="flex-1 p-3 border border-gray-300 rounded focus:outline-green-500"
                        name="loginId"
                        value={form.loginId}
                        onChange={handleChange}
                        disabled={isVerified}
                        placeholder="example@email.com"/>
                        <button className="bg-gray-200 px-4 rounded text-sm font-bold hover:bg-gray-300 transition"
                        onClick={handleSendCode}
                        disabled={isVerified}>{isCodeSent ? "재전송" : "인증받기"}</button>
                    </div>
            {isCodeSent && !isVerified && (
                <div className="flex gap-2 mt-2">
                    <input
                    className="flex-1 p-3 border border-gray-300 rounded"
                   placeholder="인증코드 6자리 입력"
                   value={vCode}
                   onChange={ (e)=> setVCode(e.target.value)}  />
                   
                   <button
                   className="bg-green-500 text-white px-6 rounded font-bold hover:bg-green-600"
                   onClick={handleVerifyCode}>
                        확인
                   </button>
                </div>
            )}
            {isVerified && <p className="text-green-600 text-sm mt-1">인증완료</p>}
            </div>

            <div className="flex flex-col">
                <div className="flex flex-col">
                    <label className="font-bold mb-1 text-gray-700 text-sm">비밀번호</label>
                    <input 
                        className={`p-3 border rounded focus:outline-none ${pwdError ? 'border-red-500' : 'border-gray-300 focus:border-green-500'}`}
                        name="mpwd" type="password" value={form.mpwd} onChange={handleChange} placeholder="비밀번호 입력"
                    />
                </div>

               
                <div className="flex flex-col">
                    <label className="font-bold mb-1 text-gray-700 text-sm">비밀번호 확인</label>
                    <input 
                        className={`p-3 border rounded focus:outline-none ${pwdError ? 'border-red-500 text-red-500' : 'border-gray-300 focus:border-green-500'}`}
                        name="mpwdConfirm" type="password" value={form.mpwdConfirm} onChange={handleChange} placeholder="비밀번호 다시 입력"
                    />
                    {pwdError && <span className="text-red-500 text-xs mt-1 ml-1">비밀번호가 일치하지 않습니다.</span>}
                    {!pwdError && form.mpwdConfirm && <span className="text-green-600 text-xs mt-1 ml-1">비밀번호가 일치합니다.</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label className="font-bold mb-1 text-gray-700 text-sm">이름</label>
                    <input className="p-3 border border-gray-300 rounded" name="mname"value={form.mname} onChange={handleChange} />
                </div>
                <div className="flex flex-col">
                    <label className="font-bold mb-1 text-gray-700 text-sm">연락처</label>
                    <input className="p-3 border border-gray-300 rounded" name="tel" value={form.tel} placeholder="010-0000-0000" onChange={handleChange} />
                </div>
            </div>
            <div>
                    <label className="font-bold mb-1 block text-gray-700 text-sm">성별</label>
                    <div className="flex gap-4 p-3 bg-gray-50 rounded border border-gray-200 justify-around">
                       <label className="text-sm"><input type="radio" name="gender" value="0" defaultChecked onChange={handleChange} /> 미지정</label>
                        <label className="text-sm"><input type="radio" name="gender" value="1" onChange={handleChange} /> 남성</label>
                        <label className="text-sm"><input type="radio" name="gender" value="2" onChange={handleChange} /> 여성</label>
                        
                    </div>
                </div>

                <button 
                    className={`w-full p-4 rounded text-white font-extrabold text-xl shadow-md transition-all 
                        ${(isVerified && !pwdError && form.mpwd) ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
                    disabled={!isVerified || pwdError || !form.mpwd}
                    onClick={handleClickSignup}
                >
                    가입하기
                </button>

        </div>
        </div>
            


            
        </div>

    )
}
export default SignupComponent
