import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const BasicMenu =() => {

const navigate = useNavigate()

const isLoggedIn = !!localStorage.getItem("member")

const handleLogout= () => {
    localStorage.removeItem("member")
    navigate("/")
    window.location.reload()
}

    const menuItem = [
        {
            name: "상품",
            path:"/"
        },
        {
            name: "기획전",
            path:"/"
        },
        {
            name: "고객센터",
            path:"/"
        },
        {
            name: "입점신청",
            path:"/"
        },
    ]

    return(
        <div className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo 영역 */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-3 h-20" >
                        <img alt="G-Origin Mall Logo" className="h-full w-auto" data-alt="G-Origin Mall professional logo featuring green and gold elements" src={logo} />
                    </Link>
                    {/* 메뉴 영역 */}
                    <nav className="hidden md:flex">
                        <ul className="flex items-center space-x-8">
                            {menuItem.map((item)=>(
                                <li key={item.name} className="text-sm font-semibold hover:text-primary transition-colors">
                                    <Link to={item.path}>{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    
                    <div className="flex items-center gap-4">
                        {/* 검색창 */}
                        <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-4 py-1.5">
                            <span className="material-symbols-outlined text-slate-400 text-lg leading-none">search</span>
                            <input className="bg-transparent border-none focus:ring-0 text-sm w-48 placeholder:text-slate-400" 
                            placeholder="검색어를 입력해주세요" 
                            type="text" />
                        </div>
                        {/* 장바구니 */}
                        <Link to={"/cart"} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
                            <span className="material-symbols-outlined">shopping_cart</span>
                            <span className="absolute top-1 right-1 bg-secondary text-[10px] font-bold px-1 rounded-full text-white">3</span>
                        </Link>
                        {/* 로그인 */}
                        {isLoggedIn ?(
                           <>
                           <Link
                           to="/mypage"
                           className="hidden sm:flex items-center gap-2 text-sm font-bold bg-slate-100 text-slate-700 px-5 py-2 rounded-full hover:bg-slate-200 transition-colors"
                           >
                            <span className="material-symbols-outlined text-lg">account_circle</span>
                            마이페이지
                           </Link>
                           <button
                            onClick={handleLogout}
                            className="hidden sm:flex items-center gap-2 text-sm font-bold bg-primary text-white px-5 py-2 rounded-full hover:bg-accent transition-colors">
                       <span className="material-symbols-outlined text-lg">logout</span>
                       로그아웃</button></>) : ( <>
                        <Link to={"/login"} className="hidden sm:flex items-center gap-2 text-sm font-bold bg-primary text-white px-5 py-2 rounded-full hover:bg-accent transition-colors">
                            <span className="material-symbols-outlined text-lg">person</span>
                            로그인
                        </Link>
                       <Link to={"/signup"} className="hidden sm:flex items-center gap-2 text-sm font-bold bg-primary text-white px-5 py-2 rounded-full hover:bg-accent transition-colors">
                            <span className="material-symbols-outlined text-lg">person</span>
                            회원가입
                        </Link></>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BasicMenu