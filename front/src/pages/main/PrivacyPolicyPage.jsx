import BasicLayout from "../../layouts/BasicLayout";
import { Link } from "react-router-dom";
const PrivacyPolicyPage = () => {
  return (
    <BasicLayout>
        <div className="w-full min-h-screen flex justify-center items-center py-10">
            <div className="w-full max-w-4xl bg-white p-8 rounded-xl">

                {/* 타이틀 */}
                <div className="mb-20 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                    개인정보 처리방침
                    </h1>
                </div>

            {/* 내용 */}
            <div className="space-y-6 text-md text-gray-700 leading-relaxed">

            <p>
                <strong>개인정보의 수집·이용 관련 의무</strong><br />
                지-오리진-몰은 이용자의 개인정보를 중요하게 생각하며,
                개인정보 보호법 등 관련 법령을 준수합니다.
            </p>

            <p>
                <strong>개인정보 수집 및 이용 시 동의</strong><br />
                개인정보를 수집하는 경우 다음 사항을 이용자에게 알리고 동의를 받습니다.<br />
                - 수집 및 이용 목적<br />
                - 수집하는 개인정보 항목<br />
                - 보유 및 이용 기간<br />
                - 동의 거부 권리 및 불이익
            </p>

            <p>
                <strong>개인정보 처리 방법</strong><br />
                지-오리진-몰은 다음과 같은 방법으로 개인정보 동의를 받을 수 있습니다.<br />
                - 서면 동의<br />
                - 전화 동의<br />
                - 홈페이지 동의<br />
                - 전자우편 동의
            </p>

            <p>
                <strong>개인정보 이용 내역 통지</strong><br />
                일정 규모 이상의 이용자를 대상으로 개인정보 이용 내역을 주기적으로 안내합니다.
            </p>

            <p>
                <strong>개인정보 수집 제한</strong><br />
                민감정보(건강, 정치적 성향 등)는 원칙적으로 수집하지 않으며,
                필요한 경우 별도의 동의를 받습니다.
            </p>

            <p>
                <strong>최소 정보 수집 원칙</strong><br />
                서비스 제공에 필요한 최소한의 정보만 수집하며,
                추가 정보 제공을 거부해도 서비스 이용이 제한되지 않습니다.
            </p>

            <p>
                <strong>개인정보 이용 범위 제한</strong><br />
                동의받은 범위를 초과하여 개인정보를 이용하지 않습니다.
            </p>

            <p>
                <strong>개인정보 제3자 제공</strong><br />
                다음의 경우에만 개인정보를 제3자에게 제공합니다.<br />
                - 이용자의 동의가 있는 경우<br />
                - 법령에 따른 경우
            </p>

            <p>
                <strong>업무 위탁</strong><br />
                서비스 제공을 위해 개인정보 처리 업무를 위탁할 수 있으며,
                관련 법령에 따라 관리·감독을 수행합니다.
            </p>

            <p>
                <strong>개인정보 이전</strong><br />
                사업 양도 등의 경우 개인정보 이전 사실을 사전에 통지합니다.
            </p>

            <p>
                <strong>보안 및 보호 조치</strong><br />
                개인정보 유출 방지를 위해 기술적·관리적 보호 조치를 시행합니다.
            </p>

            <p>
                <strong>이용자의 권리</strong><br />
                이용자는 언제든지 개인정보 열람, 수정, 삭제를 요청할 수 있습니다.
            </p>

            <p>
                <strong>위반 시 책임</strong><br />
                관련 법령 위반 시 형사처벌 및 과태료 등의 제재가 발생할 수 있습니다.
            </p>

            <p>
                <strong>시행일</strong><br />
                본 방침은 2026년 1월 1일부터 적용됩니다.
            </p>

            </div>

            {/* 버튼 */}
            <div className="mt-20 flex justify-center">
                <Link
                    to={"/"}
                    className="text-center flex-1 bg-surface-container-highest text-primary py-4 rounded-xl font-bold text-lg hover:bg-surface-container-high transition-all active:scale-95"
                >
                    확인
                </Link>
            </div>

        </div>
        </div>
    </BasicLayout>
  );
};

export default PrivacyPolicyPage;