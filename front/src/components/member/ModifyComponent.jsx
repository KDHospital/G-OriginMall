import { useEffect,useState } from "react";
import { getMemberInfo, updateMemberInfo } from "../../api/memberApi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import {formatPhoneNymber} from "../../components/member/LoginComponent"

const initState ={
    loginId:'',
    mname:'',
    tel:'',
    gender:0,
    currentMpwd:'',
    mpwd:'',
    reMpwd:''
}


const ModifyComponent = () =>{
    const [form, setForm] = useState({...initState})
    const [loading, setLoading] =useState(true)
    const navigate = useNavigate()

    useEffect( () => {
        getMemberInfo()
        .then( (data) => {
            setForm({
                ...initState,
                loginId: data.loginId,
                mname: data.mname,
                tel: formatPhoneNymber(data.tel),
                gender : data.gender
            })
            setLoading(false)
        })
        .catch( (err) =>{
            console.error(err)
            alert("회원정보를 불러오지 못했습니다. 다시 로그인 해주세요")
            navigate("/member/login")
        })
    },[navigate])

    

    const handleChange = (e) => {
        const {name,value} = e.target
        if(name === "tel") {
            setForm({...form, [name]: formatPhoneNymber(value)})
        }else{
            setForm({...form,[name]: name === 'gender' ? parseInt(value) : value})
        }
    }

    const handleClickModify = () => {

        if(!form.currentMpwd) {
            return alert("정보 수정을 위해 현재 비밀번호를 입력해주세요")
        }

        if(form.mpwd && form.mpwd !== form.reMpwd) {
            return alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.")
        }

        const sendData = {
            ...form,
            tel: form.tel.replace(/-/g,'')
        }
        delete sendData.reMpwd

        updateMemberInfo(sendData)
        .then( ()=> {
            alert("회원 정보가 성공적으로 수정되었습니다. 보안을 위해 다시 로그인해주세요.")
            localStorage.removeItem("member")
            delete axiosInstance.defaults.headers.common["Authorization"]
            navigate("/member/login")
        })
        .catch( (err) => {
            console.error(err)
            const errorMsg = err.response?.data?.message || "수정에 실패했습니다. 현재 비밀번호를 다시 확인해주세요."
            alert(errorMsg)
        })
    }
    if(loading) return <div className="text-center mt-10 font-bold text-gray-500">정보를 불러오는 중입니다.</div>

    return(
        <div className="max-w-lg mx-auto border-2 border-indigo-100 mt-10 p-8 bg-white shadow-xl rounded-2xl">
            <h2 className="text-3xl mb-8 font-black text-indigo-700 text-center">회원 정보 수정</h2>

            <div className="space-y-5">
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                    <label className="font-bold text-sm text-indigo-800 block mb-1">현재 비밀번호 확인</label>
                    <input 
                    type="password"
                    name="currentMpwd"
                    className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="기존 비밀번호를 입력하세요"
                    value={form.currentMpwd}
                    onChange={handleChange} />
                </div>
                <hr className="border-gray-100 my-2" />

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="font-bold text-xs text-gray-500 block mb-1">아이디(이메일)</label>
                        <input className="w-full p-3 border border-gray-100 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed" value={form.loginId} readOnly />
                    </div>
                    <div>
                        <label className="font-bold text-xs text-gray-500 block mb-1">이름</label>
                        <input className="w-full p-3 border border-gray-100 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed" value={form.mname} readOnly />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="font-bold text-sm text-gray-700 block mb-1">새 비밀번호</label>
                            <input 
                            type="password"
                            name="mpwd"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                            placeholder="변경 시에만 입력"
                            value={form.mpwd}
                            onChange={handleChange}/>
                        </div>
                        <div>
                            <label className="font-bold text-sm text-gray-700 block mb-1">새 비밀번호 확인</label>
                        <input 
                            type="password"
                            name="reMpwd"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                            placeholder="한 번 더 입력"
                            value={form.reMpwd}
                            onChange={handleChange}/>
                        </div>
                    </div>
                    <div>
                        <label className="font-bold text-sm text-gray-700 block mb-1">연락처</label>
                        <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none "
                        name="tel"
                        value={form.tel}
                        onChange={handleChange}
                        maxLength="13"/>

                    </div>

                    <div>
                        <label className="font-bold text-sm text-gray-700 block mb-1">성별</label>
                <div className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 justify-around">
                    {['미지정','남성','여성'].map((label,idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer text-sm">
                            <input />
                        </label>
                    ))}
                </div>
                    </div>

                </div>
            </div>
        </div>

    )
}

export default ModifyComponent





