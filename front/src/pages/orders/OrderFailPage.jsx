import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import axiosInstance from "../../api/axios";

export default function OrderFailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const errorCode = searchParams.get("code");
    const errorMsg  = searchParams.get("message");
    const orderId   = searchParams.get("orderId");

    useEffect(() => {
        // orderId가 있으면 결제 실패 처리
        if (orderId) {
             axiosInstance.patch(`/orders/${orderId}/fail`)  // split 제거
            .catch((err) => console.error("결제 실패 처리 오류:", err));
        }
    }, []);

    const getFriendlyMessage = (code) => {
        switch (code) {
            case "PAY_PROCESS_CANCELED":    return "결제가 취소되었습니다.";
            case "PAY_PROCESS_ABORTED":     return "결제 진행 중 오류가 발생했습니다.";
            case "REJECT_CARD_COMPANY":     return "카드사에서 결제를 거절했습니다.";
            case "INSUFFICIENT_BALANCE":    return "잔액이 부족합니다.";
            case "INVALID_CARD_EXPIRATION": return "카드 유효기간이 올바르지 않습니다.";
            case "INVALID_STOPPED_CARD":    return "정지된 카드입니다.";
            default: return errorMsg ?? "결제에 실패했습니다. 다시 시도해주세요.";
        }
    };

    return (
        <BasicLayout>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white border border-gray-200 rounded p-8 max-w-sm w-full text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-500 text-xl">✕</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2">결제에 실패했습니다</h2>
                    <p className="text-sm text-gray-500 mb-1">
                        {getFriendlyMessage(errorCode)}
                    </p>
                    {errorCode && (
                        <p className="text-xs text-gray-300 mb-6">에러코드: {errorCode}</p>
                    )}
                    <div className="flex flex-col gap-2 mt-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full py-2.5 bg-gray-800 text-white text-sm font-bold rounded hover:bg-gray-700 transition-colors"
                        >
                            다시 시도하기
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full py-2.5 border border-gray-300 text-gray-600 text-sm font-bold rounded hover:bg-gray-50 transition-colors"
                        >
                            쇼핑 계속하기
                        </button>
                    </div>
                </div>
            </div>
        </BasicLayout>
    );
}