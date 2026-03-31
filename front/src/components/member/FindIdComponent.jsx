import { useState } from "react";
import { findMemberId } from "../../api/memberApi";
import { useNavigate } from "react-router-dom";

const initState = {
    mname: "",
    tel: ""
}

const FindIdComponent = () =>{
    
    const navigate = useNavigate();
    const [info, setInfo] = useState({...initState})
    const [resultId , setResultId] = useState("")

    const handleChange = (e) => {
        const {name, value} = e.target
        setInfo({...info, [name]: value})
    }

    const handelClickFind = () => {
        if(!info.mname || !info.tel) return alert("이름과 전화번호를 입력해주세요")
        
        findMemberId({mname: info.mname, tel: info.tel.replace(/[^0-9]/g,'')})
        .then(res => {
            setResultId(res.data.loginId)
        })
        .catch(err => {
            alert(err.response?.data?.message || "정보를 찾을 수 없습니다.")
        })
    
        }

        const handleReset = () => {
            setInfo({...initState})
            setResultId("")
        }

        return(
            <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-3xl font-black mb-8 text-center text-indigo-700"> 아이디 찾기</h2>
            {!resultId ? (
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">이름</label>
                    <input 
                    name="mname"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="성합을 입력하세요"
                    value={info.mname}
                    onChange={handleChange}/>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-1">전화번호</label> 
                    <input 
                    name="tel"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="전화번호를 입력해주세요"
                    value={info.tel}
                    onChange={handleChange}
                    />
                    </div>
                    <button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-black text-lg shadow-lg transition-all transform active:scale-95"
                    onClick={handelClickFind}>
                        아이디 찾기
                    </button>
                </div>
           ): (  
           <div className="text-center p-6 bg-indigo-50 rounded-2xl border border-indigo-100 animate-pulse-once">
            <p className="text-gray-500 font-medium">찾으시는 아이디는 다음과 같습니다.</p>
            <div className="my-4 p-4 bg-white rounded-xl shadow-inner border border-indigo-100">
                <p className="text-2xl font-black text-indigo-700 break-all">{resultId}</p>
            </div>
            <button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl font-bold transition-all"
            onClick={() => navigate("/member/login")}
            >로그인하러 가기
             </button>
             <button 
             className="w-full bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 p-3 rounded-xl font-bold transition-all"
             onClick={() => navigate("/findpwd")}
                 >
              비밀번호 찾기
           </button>
           </div>
           ) }
            </div>

        )
}
export default FindIdComponent






















