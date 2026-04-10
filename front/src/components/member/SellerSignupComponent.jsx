import { useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmailCode , verifyEmailCode } from "../../api/memberApi";
import axiosInstance from "../../api/axios";


const initState = {
    loginId : '',
    mpwd : '',
    mpwdConfirm : '',
    mname : '',
    tel : '',
    gender : 0,
    businessNo : '',
    taxInvoice : false,
    settlementBank : '',
    bankAccount : '',
    settlementName : '',
    isVerified: false,
    description: '',
    cashReceiptNo: ''
}

const formatNumber = (value, type) => {
    if(!value) return ""
    const num = value.replace(/[^0-9]/g,'')
    if(type === 'tel') {
        if (num.length <= 3) return num
        if (num.length <=7 ) return `${num.slice(0,3)}-${num.slice(3)}`
        return `${num.slice(0,3)}-${num.slice(3,7)}-${num.slice(7,11)}`
    }
    if( type === 'biz') {
        if (num.length <= 3) return num
        if (num.length <= 5) return `${num.slice(0,3)}-${num.slice(3)}`
        return `${num.slice(0,3)}-${num.slice(3,5)}-${num.slice(5,10)}`
    }
    return num
}

const SellerSingupComponent = () => {

    const [form, setForm] = useState({...initState})
    const [vCode,setVCode] = useState("")
    const [isCodeSent , setIsCodeSent ] = useState(false)
    const [isEmailVerified , setIsEmailVerified] = useState(false)
    const [isSending , setIsSending] = useState(false)
    const [showCashInput, setShowCashInput] = useState(false)
    const [timeLeft , setTimeLeft] = useState(180)
    const navigate = useNavigate()


    useEffect( () => {
        let timer
        if (isCodeSent && !isEmailVerified && timeLeft > 0) {
            timer = setInterval( () => {
                setTimeLeft((prev) => prev -1)
            },1000)
        }else if (timeLeft === 0) {
            alert("인증 시간이 만료되었습니다. 다시 시도해주세요.")
            setIsCodeSent(false)
            setTimeLeft(180)
        }
        return () => clearInterval(timer)
    }, [isCodeSent, isEmailVerified , timeLeft])
const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs <10 ? '0' : ''}${secs}`
}

const handleChange = (e) => {
    const {name ,value , type , checked } = e.target

    if (name === "cashReceiptSelect") {
        const isYes = value === "yes";
        setShowCashInput(isYes);
        if (!isYes) {
            setForm(prev => ({ ...prev, cashReceiptNo: '' })); 
        }
        return;
    }

    if (name === 'taxInvoice') {
        setForm(prev => ({ ...prev, [name]: value === 'true' }));
        return;
    }

    if (name === 'isVerified') {
        setForm(prev => ({ ...prev, [name]: checked }));
        return;
    }

    if (name === 'tel') {
        setForm(prev => ({...prev , [name]: formatNumber(value , 'tel')}))
        return
    }

    if(name === 'businessNo') {
        setForm(prev => ({...prev, [name]: formatNumber(value,'biz')}))
        return
    }

    setForm(prev => ({...prev, [name]: value}))

}

const handleSendCode = async () => {
    if(!form.loginId) return alert("이메일을 입력해주세요.")
        setIsSending(true)
    try {
        await sendEmailCode(form.loginId)
        setIsCodeSent(true)
        setTimeLeft(180)
        alert("인증번호가 발송되었습니다.")
    } catch (error) {
        alert("발송 실패: "+ error.response?.data?.message)
    } finally {
        setIsSending(false)
    }
}

const handleVerifyCode = async () => {
    try {
        await verifyEmailCode(form.loginId,vCode)
        setIsEmailVerified(true)
        alert("이메일 인증이 완료되었습니다.")
    } catch (error) {
        alert("인증번호가 일치하지 않습니다.")
    }
}

const handleClickSignup = async () => {
    if (!isEmailVerified) return alert("이메일 인증을 완료해주세요.")
    if (form.mpwd !== form.mpwdConfirm) return alert("비밀번호가 일치하지 않습니다.")
    if (!form.businessNo || form.businessNo.length < 12) return alert("올바른 사업자 번호를 입력해주세요.")
    const pwdRegex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*]).{8,20}$/;
        if (!pwdRegex.test(form.mpwd)) {
            return alert("비밀번호는 8~20자이며 영문과 숫자 또는 특수문자를 포함해야 합니다.");
        }
    const pureBizNo = form.businessNo.replace(/-/g, '');
        if (pureBizNo.length !== 10) return alert("올바른 사업자 등록번호 10자리를 입력해주세요.");

        if (!form.mname) return alert("담당자명을 입력해주세요.");

    try {
        const sendData = {
            ...form,
            tel: form.tel.replace(/-/g,''),
            businessNo: pureBizNo
        }
        await axiosInstance.post("/member/register-seller", sendData)

        alert("입점 신청이 정상적으로 접수되었습니다!\n관리자 승인 후 서비스 이용이 가능합니다.")
        navigate("/")
    } catch (error) {
        alert(error.response?.data?.message || "신청 중 오류가 발생했습니다.")
    }
}

return(
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6 font-sans">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10">
                <h2 className="text-3xl font-black text-gray-800 mb-8 border-b-4 border-indigo-500 pb-2">입점 신청</h2>

                <div className="space-y-8">
                    {/* 계정 정보 섹션 */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-indigo-700 border-b border-indigo-100 pb-2">계정 정보</h3>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">아이디(이메일)</label>
                            <div className="flex gap-2">
                                <input
                                    name="loginId" type="email" value={form.loginId} onChange={handleChange}
                                    disabled={isEmailVerified}
                                    className="flex-1 p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-200"
                                    placeholder="example@email.com" />
                                <button
                                    onClick={handleSendCode} disabled={isSending || isEmailVerified}
                                    className="px-4 bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200 transition-all text-sm whitespace-nowrap"
                                >
                                    {isCodeSent ? "재발송" : "인증번호 발송"}
                                </button>
                            </div>
                        </div>

                        {isCodeSent && !isEmailVerified && (
                            <div className="flex flex-col gap-2">
                                <div className="text-sm font-bold ml-1 text-indigo-600">인증번호 입력</div>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            value={vCode} onChange={(e) => setVCode(e.target.value)}
                                            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-300 outline-none"
                                            placeholder="6자리 숫자"
                                        />
                                        <span className="absolute right-4 top-4 text-red-500 font-bold">{formatTime(timeLeft)}</span>
                                    </div>
                                    <button onClick={handleVerifyCode} className="px-6 bg-green-400 text-white font-bold rounded-xl hover:bg-green-500 transition-all">확인</button>
                                </div>
                            </div>
                        )}
                        {isEmailVerified && <p className="text-xs text-green-600 font-bold ml-1">이메일 인증이 완료되었습니다.</p>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <input name="mpwd" type="password" placeholder="비밀번호" onChange={handleChange} className="p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400" />
                                <span className="text-[10px] text-gray-400 ml-2">* 영문, 숫자, 특수문자 포함 8~20자</span>
                            </div>
                            <div className="flex flex-col gap-1">
                            <input name="mpwdConfirm" type="password" placeholder="비밀번호 확인" onChange={handleChange} className={`p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400 h-[56px]
                           ${form.mpwdConfirm.length > 0 
                            ? (form.mpwd === form.mpwdConfirm ? 'border-green-500 focus:ring-green-400' : 'border-red-500 focus:ring-red-400')
                            : 'border-gray-200 focus:ring-indigo-400'
                           } `} />
                        
                        {form.mpwdConfirm.length > 0 && (
                            <span className={`text-[10px] font-bold ml-2 ${
                                form.mpwd === form.mpwdConfirm ? `text-green-600` : 'text-red-500'
                            }`}>
                                {form.mpwd === form.mpwdConfirm ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다.'}
                            </span>
                        )}
                            </div>
                        </div>
                    </div>

                    {/* 사업자 정보 섹션 */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-indigo-700 border-b border-indigo-100 pb-2">사업자 정보</h3>
                       <div className="space-y-4">
                           <label className="ml-1 text-sm font-bold text-gray-600">상호명</label>
                                <input
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="상호명과 업체에 대한 설명을 간략하게 입력해 주시기 바랍니다"
                                    className="w-full p-3 bg-gray-50 rounded-lg text-sm border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                           
                         </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-bold"> 
                            <div className="flex flex-col gap-2">
                                <label className="ml-1 text-gray-600">담당자명</label>
                                <input name="mname" value={form.mname} placeholder="이름" onChange={handleChange} className="p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="ml-1 text-gray-600">연락처</label>
                                <input name="tel" value={form.tel} placeholder="010-0000-0000" onChange={handleChange} className="p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400" />
                            </div>
                            
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-600 ml-1">성별</label>
                            <div className="flex gap-2">
                            <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all 
                             ${form.gender === 0 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200'}`}>
                                <input 
                                type="radio" name="gender" value="0"
                                checked={form.gender === 0}
                                onChange={() => setForm({...form,gender: 0})}
                                className="hidden"/>
                                <span className="font-bold text-sm">미지정</span>
                             </label>
                                 
                                 
                             <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all 
                             ${form.gender === 1 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200'}`}>
                                <input 
                                type="radio" name="gender" value="1"
                                checked={form.gender === 1}
                                onChange={() => setForm({...form,gender: 1})}
                                className="hidden"/>
                                <span className="font-bold text-sm">남성</span>
                             </label>
                            
                            <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all 
                             ${form.gender === 2 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200'}`}>
                                <input 
                                type="radio" name="gender" value="2"
                                checked={form.gender === 2}
                                onChange={() => setForm({...form,gender: 2})}
                                className="hidden"/>
                                <span className="font-bold text-sm">여성</span>
                             </label>
                            
                            </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="ml-1 text-sm font-bold text-gray-600">사업자 등록번호</label>
                            <input name="businessNo" value={form.businessNo} placeholder="000-00-00000" onChange={handleChange} className="p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400" />
                        </div>

                        {/* 세금계산서 발급 여부 */}
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-bold text-gray-600 ml-1">세금계산서 발급 여부</label>
                            <div className="flex gap-4">
                                <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${form.taxInvoice ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200'}`}>
                                    <input type="radio" name="taxInvoice" value="true" checked={form.taxInvoice === true} onChange={handleChange} className="hidden" />
                                    <span className="font-bold">발급</span>
                                </label>
                                <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${!form.taxInvoice ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200'}`}>
                                    <input type="radio" name="taxInvoice" value="false" checked={form.taxInvoice === false} onChange={handleChange} className="hidden" />
                                    <span className="font-bold">미발급</span>
                                </label>
                            </div>
                        </div>

                        {/* 현금영수증 섹션 */}
                        <div className="bg-gray-50 p-6 rounded-2xl space-y-4 border border-gray-100">
                            <h3 className="font-bold text-gray-700 text-sm ml-1">현금영수증 발급 설정</h3>
                            <div className="flex gap-4">
                                <label className={`flex-1 p-3 rounded-xl border text-center cursor-pointer transition-all ${showCashInput ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200'}`}>
                                    <input type="radio" name="cashReceiptSelect" value="yes" checked={showCashInput === true} onChange={handleChange} className="hidden" />
                                    <span className="font-bold text-sm">발급 신청</span>
                                </label>
                                <label className={`flex-1 p-3 rounded-xl border text-center cursor-pointer transition-all ${!showCashInput ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200'}`}>
                                    <input type="radio" name="cashReceiptSelect" value="no" checked={showCashInput === false} onChange={handleChange} className="hidden" />
                                    <span className="font-bold text-sm">미발급</span>
                                </label>
                            </div>
                            {showCashInput && (
                                <div className="animate-fade-in space-y-2">
                                    <label className="text-xs font-bold text-indigo-500 ml-1">현금영수증 번호 (휴대폰 또는 사업자번호)</label>
                                    <input
                                        name="cashReceiptNo"
                                        value={form.cashReceiptNo}
                                        onChange={handleChange}
                                        placeholder="- 없이 숫자만 입력하세요"
                                        className="w-full p-4 bg-white rounded-xl border border-indigo-200 outline-none focus:ring-2 focus:ring-indigo-400"
                                    />
                                </div>
                            )}
                        </div>

                        {/* 금빛나루 인증 */}
                        <div className="bg-white p-4 rounded-xl border border-indigo-100">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="isVerified" checked={form.isVerified} onChange={handleChange} className="w-5 h-5 accent-indigo-600" />
                                <span className="text-sm font-bold text-gray-700">금빛나루 인증 업체입니까?</span>
                            </label>
                        </div>
                        
                    </div>

                    {/* 정산 계좌 정보 섹션 */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-indigo-700 border-b border-indigo-100 pb-2">정산 계좌 정보</h3>
                        <div className="grid grid-cols-2 gap-4 font-bold">
                            <input name="settlementBank" placeholder="은행명" onChange={handleChange} className="p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400" />
                            <input name="settlementName" placeholder="예금주" onChange={handleChange} className="p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400" />
                        </div>
                        <input name="bankAccount" placeholder="계좌번호 (-제외)" onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400" />
                    </div>

                    {/* 입점 안내 및 제출 버튼 */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs leading-5">
                            <p className="font-bold mb-1">📢 입점 신청 안내</p>
                            <p>• 입점 신청은 사업자 등록증이 있는 판매자만 신청할 수 있습니다.</p>
                            <p>• 신청 후 관리자 검토를 거쳐 승인/반려 결과를 이메일로 안내드립니다.</p>
                            <p>• 승인 완료 시 판매자 권한이 부여되면 상품 등록이 가능합니다.</p>
                            <p>• 심사 기간은 영업일 기준 2~3일 소요됩니다.</p>
                        </div>

                        <button
                            disabled={!isEmailVerified}
                            onClick={handleClickSignup}
                            className={`w-full p-5 rounded-2xl font-black text-xl shadow-lg transition-all ${isEmailVerified
                                ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.01]"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            입점 신청서 제출하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )



}

export default SellerSingupComponent








