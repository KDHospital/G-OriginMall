import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import axiosInstance from "../../api/axios";
import { getCategories } from "../../api/productsApi";
import { useCart } from "../../context/CartContext";

const BasicMenu = () => {

  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem("member")

  // localStorage 받아오기
  const member = JSON.parse(localStorage.getItem("member") || "null");
  const role = member?.role ?? null;
  // role >> 0 = 구매자, 1 = 판매자, 2 = 관리자

  const [categories, setCategories] = useState([])
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false)
  const [isExMenuOpen, setIsExMenuOpen] = useState(false)

  const { cartCount } = useCart();

  useEffect(() => {
    getCategories().then(res => setCategories(res.data)).catch(err => console.error("카테고리 로드 실패", err))
  }, [])

  const handleLogout = async () => {
    try {
     await axiosInstance.post("/member/logout")
    } catch (err) {
      console.error("로그아웃 요청 중 오류 발생", err)
    } finally{
      localStorage.removeItem("member")
      window.location.href = "/"
    }
    }
    const handleRegisterSellerClick = (e) => {
    
    e.preventDefault();
    
    const member = JSON.parse(localStorage.getItem("member") || "null")
    
    if (member) {
        alert("이미 로그인된 상태입니다. 판매자 가입을 위해서는 로그아웃 후 진행해 주세요.")
        return;
    }
    
    navigate("/sellersignup");
  }

  return (
    <div className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* 로고 */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 h-20">
            <img alt="G-Origin Mall Logo" className="h-full w-auto" src={logo} />
          </Link>

          {/* 메뉴 */}
          <nav className="hidden md:flex h-full">
            <ul className="flex items-center space-x-8">

              {/* 상품 메뉴 — 호버 드롭다운 */}
              <li
                className="relative "
                onMouseEnter={() => setIsProductMenuOpen(true)}
                onMouseLeave={() => setIsProductMenuOpen(false)}
              >
                <div className="h-full flex items-center">
                  <div
                    className="text-sm font-semibold hover:text-primary transition-colors"
                  >
                    상품
                  </div>
                </div>

                {/* 드롭다운 */}
                {isProductMenuOpen && (
                  <div className="absolute left-0 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">               
                    {/* 전체 상품 */}
                    <Link
                      to="/products"
                      className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                    >
                      전체 상품
                    </Link>
                    
                    <hr className="my-1 border-slate-100" />
                    {/* 1뎁스 카테고리 목록 */}
                    {categories.map(cat => (

                      <Link
                        key={cat.categoryId}
                        to={`/products?categoryId=${cat.categoryId}`}
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                      >
                        {cat.categoryName}
                      </Link>
                    ))}

                  </div>
                )}
              </li>

              {/* 기획전 메뉴 — 호버 드롭다운 */}
              <li
                className="relative "
                onMouseEnter={() => setIsExMenuOpen(true)}
                onMouseLeave={() => setIsExMenuOpen(false)}
              >
                <div className="h-full flex items-center">
                  <div
                    className="text-sm font-semibold hover:text-primary transition-colors"
                  >
                    기획전
                  </div>
                </div>

                {/* 드롭다운 */}
                {isExMenuOpen && (
                  <div className="absolute left-0 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                    {/* 금빛나루 전용관 */}
                    <Link
                      to="/products/certified"
                      className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                    >
                      금빛나루 전용관
                    </Link>
                    <hr className="my-1 border-slate-100" />                    
                    {/* 기획전  */}
                    <Link
                      to="/products/exhibition"
                      className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                    >
                      기획전
                    </Link>

                  </div>
                )}
              </li>
              {/* 나머지 메뉴 */}
              {[
                { name: "고객센터", path: "/board" },
                { name: "입점신청", path: "/sellersignup" },
              ].map(item => (
                <li key={item.name} className="text-sm font-semibold hover:text-primary transition-colors">
                 {item.name === "입점신청" ? (
                  <Link to={item.path} onClick={handleRegisterSellerClick}>{item.name}</Link>
                 ) :(<Link to={item.path}>{item.name}</Link>
                  )}
                  
                </li>
              ))}
            </ul>
          </nav>

          {/* 우측 영역 — 검색/장바구니/로그인 (기존 코드 그대로) */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-4 py-1.5">
              <span className="material-symbols-outlined text-slate-400 text-lg leading-none">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-48 placeholder:text-slate-400"
                placeholder="검색어를 입력해주세요"
                type="text"
              />
            </div>
            {/* 장바구니 — USER만 표시 */}
            {(isLoggedIn && role === 0) && (
              <Link to="/cart" className="p-2 hover:bg-slate-100 rounded-full relative">
                <span className="material-symbols-outlined">shopping_cart</span>
                {isLoggedIn && cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-secondary text-[10px] font-bold px-1 rounded-full text-white">
                        {cartCount > 9 ? "9+" : cartCount}
                    </span>
                )}
            </Link>
            )}

            {isLoggedIn ? (
              <>
                {/* SELLER — 내 상점 버튼 */}
                {role === 1 && (
                  <Link to="/seller" className="hidden sm:flex items-center gap-2 text-sm font-bold bg-slate-100 text-slate-700 px-5 py-2 rounded-full hover:bg-slate-200 transition-colors">
                    <span className="material-symbols-outlined text-lg">storefront</span>
                    내 상점
                  </Link>
                )}

                {/* ADMIN — 관리 버튼 */}
                {role === 2 && (
                  <Link to="/admin" className="hidden sm:flex items-center gap-2 text-sm font-bold bg-slate-100 text-slate-700 px-5 py-2 rounded-full hover:bg-slate-200 transition-colors">
                    <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                    관리
                  </Link>
                )}

                {/* 공통 — 마이페이지, 로그아웃 */}
                <Link to="/mypage" className="hidden sm:flex items-center gap-2 text-sm font-bold bg-slate-100 text-slate-700 px-5 py-2 rounded-full hover:bg-slate-200 transition-colors">
                  <span className="material-symbols-outlined text-lg">account_circle</span>
                  마이페이지
                </Link>
                <button onClick={handleLogout} className="hidden sm:flex items-center gap-2 text-sm font-bold bg-primary text-white px-5 py-2 rounded-full hover:bg-accent transition-colors">
                  <span className="material-symbols-outlined text-lg">logout</span>
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:flex items-center gap-2 text-sm font-bold bg-primary text-white px-5 py-2 rounded-full hover:bg-accent transition-colors">
                  <span className="material-symbols-outlined text-lg">person</span>
                  로그인
                </Link>
                <Link to="/signup" className="hidden sm:flex items-center gap-2 text-sm font-bold bg-primary text-white px-5 py-2 rounded-full hover:bg-accent transition-colors">
                  <span className="material-symbols-outlined text-lg">person</span>
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicMenu