import BasicLayout from "../../layouts/BasicLayout";
import { Link } from "react-router-dom";
const TermsPage = () => {
  return (
    <BasicLayout>
        <div className="w-full min-h-screen flex justify-center items-center py-10">
        <div className="w-full max-w-4xl bg-white p-8 rounded-xl">

            {/* 타이틀 */}
            <div className="mb-20 text-center">
            <h1 className="text-3xl font-bold text-gray-800">
                쇼핑몰 이용약관
            </h1>
            </div>

            {/* 약관 내용 */}
            <div className="space-y-6 text-md text-gray-700 leading-relaxed">

            <p>
                <strong>제1조(목적)</strong><br />
                이 약관은 지-오리진-몰(전자상거래 사업자)이 운영하는 지-오리진-몰(이하 “지-오리진-몰”이라 한다)에서 제공하는 인터넷 관련 서비스(이하 “서비스”라 한다)를 이용함에 있어 사이버 몰과 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>

            <p>
                <strong>제2조(정의)</strong><br />
                ① “지-오리진-몰”이란 재화 또는 용역을 이용자에게 제공하기 위하여 설정한 가상의 영업장을 의미합니다.<br />
                ② “이용자”란 지-오리진-몰에 접속하여 서비스를 이용하는 회원 및 비회원을 말합니다.<br />
                ③ “회원”이라 함은 회원등록을 한 자로서 지속적으로 서비스를 이용할 수 있는 자를 말합니다.<br />
                ④ “비회원”이라 함은 회원에 가입하지 않고 서비스를 이용하는 자를 말합니다.
            </p>

            <p>
                <strong>제3조(약관의 명시 및 개정)</strong><br />
                지-오리진-몰은 관련 법령을 준수하며, 약관 변경 시 사전 공지합니다.
            </p>

            <p>
                <strong>제4조(서비스의 제공)</strong><br />
                지-오리진-몰은 다음과 같은 서비스를 제공합니다.<br />
                - 상품 정보 제공 및 구매 계약 체결<br />
                - 상품 배송<br />
                - 기타 플랫폼 운영 관련 서비스
            </p>

            <p>
                <strong>제5조(서비스 중단)</strong><br />
                시스템 점검, 통신 장애 등 불가피한 사유 발생 시 서비스 제공이 일시 중단될 수 있습니다.
            </p>

            <p>
                <strong>제6조(회원가입)</strong><br />
                이용자는 약관에 동의하고 회원가입을 신청할 수 있으며, 지-오리진-몰은 이를 승인함으로써 계약이 성립됩니다.
            </p>

            <p>
                <strong>제7조(회원 탈퇴 및 자격 상실)</strong><br />
                회원은 언제든지 탈퇴할 수 있으며, 약관 위반 시 자격이 제한될 수 있습니다.
            </p>

            <p>
                <strong>제8조(이용자의 의무)</strong><br />
                이용자는 다음 행위를 해서는 안 됩니다.<br />
                - 타인의 정보 도용<br />
                - 서비스 운영 방해<br />
                - 법령 위반 행위
            </p>

            <p>
                <strong>제9조(개인정보 보호)</strong><br />
                지-오리진-몰은 이용자의 개인정보 보호를 위해 최선을 다합니다.
            </p>

            <p>
                <strong>제10조(면책조항)</strong><br />
                천재지변 등 불가항력으로 인한 서비스 장애에 대해 책임을 지지 않습니다.
            </p>

            <p>
                <strong>부칙</strong><br />
                본 약관은 2026년 1월 1일부터 적용됩니다.
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

export default TermsPage;