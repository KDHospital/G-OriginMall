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
          <div className="max-w-md mx-auto mt-10 mb-10 p-8 bg-white rounded-3xl shadow-2xl border border-green-50 relative overflow-hidden">

    <h2 className="text-3xl font-black mb-8 text-center text-green-700">아이디 찾기</h2>
    
    {!resultId ? (
        <div className="space-y-5">
            {/* 이름 입력 */}
            <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5 ml-1">이름</label>
                <input 
                    name="mname"
                    value={info.mname}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-gray-300"
                    placeholder="성함을 입력하세요"
                />
            </div>

            {/* 전화번호 입력 */}
            <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5 ml-1">전화번호</label> 
                <input 
                    name="tel"
                    value={info.tel}
                    onChange={handleChange}
                    className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-gray-300"
                    placeholder="전화번호를 입력해주세요"
                />
            </div>

            <button
                className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl font-black text-lg shadow-lg shadow-green-100 transition-all transform active:scale-95 mt-4"
                onClick={handelClickFind}
            >
                아이디 찾기
            </button>
        </div>
    ) : (  
        /* 아이디 결과 화면 */
        <div className="text-center space-y-4 animate-fadeIn">
            <div className="p-8 bg-yellow-50 rounded-3xl border border-yellow-100 relative">

                <p className="text-gray-600 font-medium mb-3">찾으시는 아이디는 다음과 같습니다.</p>
                
                <div className="my-4 p-5 bg-white rounded-2xl shadow-inner border border-yellow-200">
                    <p className="text-2xl font-black text-green-700 break-all tracking-tight">
                        {resultId}
                    </p>
                </div>
                
                <p className="text-[11px] text-yellow-700 font-bold">보안을 위해 아이디의 일부가 숨겨져 보일 수 있습니다.</p>
            </div>

            <div className="space-y-2 pt-4">
                <button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-2xl font-black shadow-lg transition-all transform active:scale-95"
                    onClick={() => navigate("/login")}
                >
                    로그인하러 가기
                </button>
                
                <button 
                    className="w-full bg-white border-2 border-green-100 text-green-600 hover:bg-green-50 p-4 rounded-2xl font-bold transition-all"
                    onClick={() => navigate("/findpwd")}
                >
                    비밀번호 찾기
                </button>
            </div>
        </div>
    )}
</div>

        )
}
export default FindIdComponent






















