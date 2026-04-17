import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const FooterMenu = () =>{

    const navigate = useNavigate()

    const isLoggedIn = !!localStorage.getItem("member")

    const footerMenuItem = [
        {
            name:"김포시 특산물 쇼핑몰 소개",
            path:"/aboutPage"
        },
        {
            name:"개인정보 처리 방침",
            path:"/privacyPolicy"
        },
        {
            name:"이용약관",
            path:"/termsPage"
        },
        {
            name:"고객센터",
            path:"/board"
        },
        {
            name:"입점신청",
            path:"/sellersignup"
        },
    ]

    const handleRegisterSellERClick = (e) => {
        e.preventDefault()
        
        if(isLoggedIn) {
            alert("이미 로그인된 상태입니다. 판매자 가입을 위해서는 로그아웃 후 진행해 주세요")
            return
        }

        navigate("sellersignup")
    }
    return(
            <footer className="bg-slate-100 pt-20 pb-10 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between mb-16">
                        <div className="">
                            <div className="flex items-center gap-3 mb-6">
                                <img alt="G-Origin Mall Logo" className="h-20 w-auto opacity-70" data-alt="G-Origin Mall logo icon" src={logo} />
                            </div>
                            {/* 아이콘 링크 영역 인스타,블로그,등 */}
                            <div className="flex gap-4 items-center">
                                <Link to={"/"} className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-primary hover:text-white transition-colors" href="#">
                                    <span className="material-symbols-outlined text-lg">public</span>
                                </Link>
                                <Link to={"/"} className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-primary hover:text-white transition-colors" href="#">
                                    <span className="material-symbols-outlined text-lg">photo_camera</span>
                                </Link>
                                <Link to={"/"} className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-primary hover:text-white transition-colors" href="#">
                                    <span className="material-symbols-outlined text-lg">chat</span>
                                </Link>
                            </div>
                            {/* G-Origin-mall 정보 */}
                            <div className="border-slate-200 pt-10 text-xs text-slate-400">
                                <p className="mb-2">G-Origin Mall | CEO: Kim Gim-po | Business Registration: 123-45-67890</p>
                                <p className="mb-2">Address: 123 Geumbit-ro, Gimpo-si, Gyeonggi-do, Republic of Korea</p>
                                <p>Customer Center: 1588-0000 (09:00 - 18:00, Weekends/Holidays closed)</p>
                                <p>© 2026 G-Origin Mall. All rights reserved.</p>
                            </div>
                        </div>
                        {/* 푸터 메뉴 영역 */}
                        <div className="linkDiv">
                            <h5 className="font-bold mb-6">G-Origin-Mall</h5>
                            <ul className="space-y-4 text-sm text-slate-500">
                                {footerMenuItem.map((item)=>(
                                    <li key={item.name} className="hover:text-primary transition-colors">
                                        {item.name === "입점신청" ? (
                                            <button 
                                            onClick={handleRegisterSellERClick}
                                            className="text-left bg- bg-transparent border-none p-0 cursor-pointer">
                                               {item.name} 
                                            </button>
                                        ) : (
                                        <Link to={item.path}>{item.name}</Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
    )
}

export default FooterMenu