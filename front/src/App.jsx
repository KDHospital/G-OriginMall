import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from "react"
import axiosInstance from "./api/axios";
import MainPage from './pages/main/MainPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import CartPage from './pages/cart/CartPage';
import UserSignupPage from './pages/member/UserSignupPage';
import JoinPage from './pages/member/JoinPage';
import AdminProductNewPage from './pages/admin/AdminProductNewPage';
import OrderFormPage from './pages/orders/OrderFormPage';
import Mypapge from './pages/member/MyPage';

// 팀원들이 페이지 컴포넌트 만들면 여기에 import 추가
// 예시:
// import JoinPage from './pages/member/JoinPage';
// import SellerPage from './pages/member/SellerPage';
// import ProductListPage from './pages/product/ProductListPage';
// import OrderPage from './pages/order/OrderPage';



function App() {

  useEffect(()=>{

        axiosInstance.get('/test')
        .then((res) => console.log("Axios로 CORS :", res.data))
        .catch((err) => console.error("Axios로 CORS :", err));

  },[]);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 */}
        <Route path="/" element={<MainPage />} />

        {/* 회원(구매자) - 유재영 담당 */}
        {/* <Route path="/join" element={<JoinPage />} /> */}
        <Route path='/signup' element={<UserSignupPage />} />
        <Route path='/member/login' element={<JoinPage />} />
        <Route path='/mypage' element={<Mypapge />} />
        {/* 회원(판매자) - 유재영 담당 */}
        {/* <Route path="/sellerjoin" element={<SellerJoinPage />} /> */}
        
        {/* 장바구니 - 김슬기 담당 */}
        <Route path="/cart" element={<CartPage />} />

        {/* 상품 - 이효진 담당 */}
        {/* <Route path="/products" element={<ProductListPage />} /> */}

        {/* 주문 - 김슬기 담당 */}
        <Route path="/orders/new" element={<OrderFormPage />} />
        {/* <Route path="/orders" element={<OrderPage />} /> */}

        {/* 어드민 */}
        <Route path="/admin" element={<AdminDashboardPage />} />


        {/* 어드민-상품등록 */}
        <Route path="/admin/products/new" element={<AdminProductNewPage />} />

      </Routes>
    </BrowserRouter>
      );
}

export default App