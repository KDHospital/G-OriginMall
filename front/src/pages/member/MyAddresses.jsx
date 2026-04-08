import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import axiosInstance from "../../api/axios";
import MyPageComponent from "../../components/member/MyPageComponent";
import AddressSection from "../../components/member/AddressSection";

export default function MyAddresses() {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        const savedMember = localStorage.getItem("member");
        if (!savedMember) {
            alert("로그인이 필요한 서비스입니다.");
            navigate("/login");
            return;
        }

        axiosInstance.get("/members/addresses")
            .then((res) => setAddresses(res.data))
            .catch((err) => console.error("배송지 로드 실패:", err));
    }, []);

    return (
        <BasicLayout>
            <div className="max-w-7xl mx-auto flex gap-8 p-10 bg-gray-50 min-h-screen">
                <MyPageComponent member={null} />

                <main className="flex-grow space-y-6">
                    <h2 className="text-2xl font-bold border-l-4 border-black pl-3">배송지 관리</h2>
                    <AddressSection
                        addresses={addresses}
                        showSelection={false}
                    />
                </main>
            </div>
        </BasicLayout>
    );
}