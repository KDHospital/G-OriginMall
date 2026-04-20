import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMemberInfo } from "../../api/memberApi";
import axiosInstance from "../../api/axios";
import MyPageComponent from "../../components/member/MyPageComponent";
import { BASE_URL } from "../../util/imagesUtil";
import SellerLayout from "../../layouts/SellerLayout"
const SellerProfilePage = () => {
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);

    const genderMap = { 0: "미지정", 1: "남성", 2: "여성" };

    const formatPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return "";
        const num = phoneNumber.replace(/[^0-9]/g, "");
        return num.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    };    

    useEffect(() => {
        // 회원 정보
        getMemberInfo()
            .then((res) => {
                setMember(res.data);
                setLoading(false);
                console.log(res.data)
            })
            .catch((err) => {
                console.error("내 정보 불러오기 실패:", err);
                alert("세션이 만료되었거나 정보를 가져올 수 없습니다. 다시 로그인해주세요.");
                localStorage.removeItem("member");
                navigate("/login");
            });
    }, [navigate]);

    if (loading) {
        return <div className="text-center p-20 font-bold">데이터를 불러오는 중입니다.</div>;
    }


    return(
        <SellerLayout>
            {/* 페이지 타이틀 */}
            <h2 className="text-lg font-bold text-gray-700 border-l-4 border-green-500 pl-3 mb-5">
                판매자 정보
            </h2>      
            <div className="space-y-5">
                <section className="bg-white rounded-md p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 mb-1">회원 정보</h3>
                    <p className="text-xs text-gray-400 mb-4">판매자 정보</p>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">
                                아이디 
                                <span className="text-gray-300 ml-1">login_id</span>
                            </label>
                            <div className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 bg-gray-100">
                                {member.loginId}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">
                                이름 
                                <span className="text-gray-300 ml-1">mname</span>
                            </label>
                            <div className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 bg-gray-100">
                                {member.mname}
                            </div>                            
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">
                                연락처 
                                <span className="text-gray-300 ml-1">tel</span>
                            </label>
                            <div className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 bg-gray-100">
                                {formatPhoneNumber(member.tel)}
                            </div>                            
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">
                                성별 
                                <span className="text-gray-300 ml-1">gender</span>
                            </label>
                            <div className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 bg-gray-100">
                                {genderMap[member.gender] || "정보 없음"}
                            </div>                            
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">
                                가입일 
                                <span className="text-gray-300 ml-1">created_at</span>
                            </label>
                            <div className="w-full border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 bg-gray-100">
                                {member.created_at ? member.created_at.split('T')[0] : 정보없음}
                            </div>                            
                        </div>
                    </div>
                </section>
                <div className="flex justify-end gap-3 pb-6">
                    <button
                        onClick={() => navigate("/modifypage")} 
                        className="px-6 py-2.5 bg-green-700 text-white text-sm font-bold rounded hover:bg-green-600 active:bg-green-800 transition-colors"
                    >
                        수정
                    </button>            
                </div>                
            </div> 
        </SellerLayout>
    )
}
export default SellerProfilePage