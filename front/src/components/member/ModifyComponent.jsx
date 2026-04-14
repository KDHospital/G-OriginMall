import { useEffect,useState } from "react";
import { getMemberInfo, updateMemberInfo } from "../../api/memberApi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";


const initState ={
    id:0,
    loginId:'',
    mname:'',
    tel:'',
    gender:0,
    currentMpwd:'',
    mpwd:'',
    reMpwd:'',
    isSocial: false
}

 const formatPhoneNumber = (value) => {
        if (!value) return "";
        const num = value.replace(/[^0-9]/g, '');
        if (num.length <= 3) return num;
        if (num.length <= 7) return `${num.slice(0, 3)}-${num.slice(3)}`;
        return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
    }

const ModifyComponent = () =>{
    const [form, setForm] = useState({...initState})
    const [loading, setLoading] =useState(true)
    const navigate = useNavigate()

    useEffect( () => {
        getMemberInfo()
        .then( (res) => {
           const memberData = res.data || res
           console.log("불러온 정보:",memberData)
            setForm({
                ...initState,
                id:memberData.id,
                loginId: memberData.loginId || "",
                mname: memberData.mname || '',
                tel: formatPhoneNumber(memberData.tel || ''),
                gender : memberData.gender ?? 0,
                isSocial: memberData.social === true,
                needsExtraInfo: memberData.needsExtraInfo === true
            })
            setLoading(false)
        })
        .catch( (err) =>{
            console.error(err)
            alert("회원정보를 불러오지 못했습니다. 다시 로그인 해주세요")
            navigate("/login")
        })
    },[navigate])

    

    const handleChange = (e) => {
        const {name,value} = e.target
        if(name === "tel") {
            setForm({...form, [name]: formatPhoneNumber(value)})
        }else{
            setForm({...form,[name]: name === 'gender' ? parseInt(value) : value})
        }
    }

    const handleClickModify = () => {

        if(!form.isSocial && !form.currentMpwd) {
            return alert("정보 수정을 위해 현재 비밀번호를 입력해주세요")
        }

        if(form.mpwd && form.mpwd !== form.reMpwd) {
            return alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.")
        }
        const memberId = Number(form.id)
        if (!memberId || isNaN(memberId)){
            return alert("회원 번호(ID)가 유효하지 않습니다. 다시 로그인 해주세요")
        }

        const sendData = {
            id:memberId,
            loginId: String(form.loginId),
            mname:form.mname,
            currentMpwd: form.isSocial ? "" : form.currentMpwd,
            tel:form.tel.replace(/-/g,''),
            gender: Number(form.gender),
            isSocial: form.isSocial
        }
        
       
        if(form.mpwd && form.mpwd.trim() !==""){
            sendData.mpwd = form.mpwd
        }
        console.log("최종 전송 데이터 객체:",sendData)
        updateMemberInfo(sendData)
        .then( ()=> {
            alert("회원 정보가 성공적으로 수정되었습니다. 보안을 위해 다시 로그인해주세요.")
            localStorage.removeItem("member")
            delete axiosInstance.defaults.headers.common["Authorization"]
            navigate("/login")
        })
        .catch( (err) => {
            console.error("수정 에러 상세:",err.response?.data)
            const errorMsg = err.response?.data?.message || "수정에 실패했습니다. 현재 비밀번호를 다시 확인해주세요."
            alert(errorMsg)
        })
    }
    if(loading) return <div className="text-center mt-10 font-bold text-gray-500">정보를 불러오는 중입니다.</div>

    return(
        <div className="max-w-lg mx-auto border-2 border-green-100 mt-10 p-8 bg-white shadow-xl rounded-2xl">
        <h2 className="text-3xl mb-8 font-black text-green-700 text-center">회원 정보 수정</h2>

        <div className="space-y-6"> {/* 간격을 위해 space-y-6으로 변경 */}
            
            {/* 1. 현재 비밀번호 확인 (일반 유저만 표시) */}
            {!form.isSocial ? (
            <div className="p-4 bg-indigo-50 rounded-xl border border-green-200">
                <label className="font-bold text-sm text-green-800 block mb-1">현재 비밀번호 확인</label>
                <input 
                    type="password"
                    name="currentMpwd"
                    className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="기존 비밀번호를 입력하세요"
                    value={form.currentMpwd}
                    onChange={handleChange} 
                />
            </div>
            ): (
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 ">
                    <p className="text-sm font-bold text-amber-700 flex items-center gap-2">
                        소셜 계정으로 로그인 중입니다.
                    </p>
                <p className="text-xs text-amber-600 mt-1">비밀번호 확인 없이 정보 수정이 가능합니다.</p>
                </div>

            )}

            <hr className="border-gray-100" />

           
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="font-bold text-xs text-gray-500 block mb-1">아이디(이메일)</label>
                    <input className="w-full p-3 border border-gray-100 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed" value={form.loginId} readOnly />
                </div>
                <div>
                    <label className="font-bold text-xs text-gray-500 block mb-1">이름</label>
    <input 
        name="mname"
        value={form.mname}
        onChange={handleChange}
        
        readOnly={!(form.isSocial && form.needsExtraInfo)}
        className={`w-full p-3 border rounded-lg outline-none ${
            form.isSocial && form.needsExtraInfo
            ? "border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-green-400" 
            : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed" 
        }`}
    />
    
   
    {!form.isSocial ? (
        <p className="text-[10px] text-gray-400 mt-1">* 일반 회원은 이름을 수정할 수 없습니다.</p>
    ) : form.needsExtraInfo ? (
        <p className="text-[10px] text-green-600 mt-1">* 소셜 회원은 최초 1회만 본명으로 수정이 가능합니다.</p>
    ) : (
        <p className="text-[10px] text-gray-400 mt-1">* 이미 이름 변경이 완료된 소셜 계정입니다.</p>
    )}
</div>
            </div>

           {!form.isSocial ?(
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="font-bold text-sm text-gray-700 block mb-1">새 비밀번호</label>
                    <input 
                        type="password"
                        name="mpwd"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                        placeholder="변경 시에만 입력해주세요"
                        value={form.mpwd}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="font-bold text-sm text-gray-700 block mb-1">새 비밀번호 확인</label>
                    <input 
                        type="password"
                        name="reMpwd"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                        placeholder="한 번 더 입력해주세요"
                        value={form.reMpwd}
                        onChange={handleChange}
                    />
                </div>
            </div>
                ) : (<></>)}
            
            <div>
                <label className="font-bold text-sm text-gray-700 block mb-1">연락처</label>
                <input 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                    name="tel"
                    value={form.tel}
                    onChange={handleChange}
                    maxLength="13"
                />
            </div>

           
            <div>
                <label className="font-bold text-sm text-gray-700 block mb-1">성별</label>
                <div className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 justify-around">
                    {['미지정', '남성', '여성'].map((label, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                            <input 
                                type="radio" 
                                name="gender" 
                                value={idx} 
                                checked={form.gender === idx} 
                                onChange={handleChange} 
                                className="w-4 h-4 accent-green-600"
                            />
                            {label}
                        </label>
                    ))}
                </div>
            </div>

           
            <div className="flex gap-4 pt-6">
                <button 
                    className="flex-1 p-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    onClick={() => navigate(-1)}
                >
                    취소
                </button>
                <button 
                    className="flex-1 p-4 bg-green-600 text-white rounded-xl font-black shadow-lg hover:bg-green-700 transition-all"
                    onClick={handleClickModify}
                >
                    정보 수정 완료
                </button>
            </div>
        </div>
    </div>
    )
}

export default ModifyComponent





