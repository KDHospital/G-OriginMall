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
import ProductListPage from './pages/products/ProductListPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import OrderSuccessPage from './pages/orders/OrderSuccessPage';
import OrderFailPage from './pages/orders/OrderFailPage';
import MyOrders from './pages/member/MyOrders';
import MyOrderDetail from './pages/member/MyOrderDetail';

import ModifyPage from './pages/member/ModifyPage';
import Mypapge from './pages/member/MyPage';
import FindIdPage from './pages/member/FindIdPage';
import FindPwdPage from './pages/member/FindPwdPage';

import SellerDashboardPage from './pages/seller/SellerDashboardPage';
import SellerProductNewPage from './pages/seller/SellerProductNewPage';
import SellerProductListPage from './pages/seller/SellerProductListPage';

import AdminBoardListPage from './pages/admin/AdminBoardListPage';
import AdminBoardAddPage from './pages/admin/AdminBoardAddPage';
import AdminBoardReadPage from './pages/admin/AdminBoardReadPage';
import AdminBoardModifyPage from './pages/admin/AdminBoardModifyPage';
import AdminInquiryPage from './pages/admin/AdminInquiryPage';

import BoardPage from './pages/support/BoardPage';
import BoardReadPage from './pages/support/BoardReadPage';
import InquiryPage from './pages/support/InquiryPage';
import InquiryAddModal from './pages/support/InquiryAddModal';
import FaqPage from './pages/support/FaqPage';

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
        <Route path='/signup' element={<UserSignupPage />} />
        <Route path='/login' element={<JoinPage />} />
        <Route path='/mypage' element={<Mypapge />} />
        <Route path='/modifypage' element={<ModifyPage />} />
        <Route path='/findid' element={<FindIdPage />} />
        <Route path='/findpwd' element={<FindPwdPage />} />
        {/* 회원(판매자) - 유재영 담당 */}
        {/* <Route path="/sellerjoin" element={<SellerJoinPage />} /> */}
        
        {/* 장바구니 - 김슬기 담당 */}
        <Route path="/cart" element={<CartPage />} />

        {/* 상품 - 이효진 담당 */}
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />

        {/* 주문 - 김슬기 담당 */}
        <Route path="/orders/new" element={<OrderFormPage />} />
        <Route path="/orders/success" element={<OrderSuccessPage />} />
        <Route path="/orders/fail"    element={<OrderFailPage />} />
        <Route path="/orders" element={<MyOrders />} /> 
        <Route path="/orders/:orderId" element={<MyOrderDetail />} />

        {/* 게시판>공지사항 - 신시온 담당*/}
        <Route path="/board" element={<BoardPage />} />
        <Route path="/board/read/:bno" element={<BoardReadPage />} />
        <Route path="/inquiry" element={<InquiryPage />} />
        <Route path="/inquiry/add" element={<InquiryAddModal />} />
        <Route path="/faq" element={<FaqPage />} />




        {/* 어드민 */}
        <Route path="/admin" element={<AdminDashboardPage />} />

        {/* 판매자 */}
        <Route path="/seller" element={<SellerDashboardPage />} />
        <Route path="/seller/products/new" element={<SellerProductNewPage />} />
        <Route path="/seller/products" element={<SellerProductListPage />} />


        {/* 어드민-상품등록 */}
        <Route path="/admin/products/new" element={<AdminProductNewPage />} />



        {/* 어드민-게시판>공지사항 - 신시온 담당*/}
        <Route path="/admin/board" element={<AdminBoardListPage />} />
        <Route path="/admin/board/new" element={<AdminBoardAddPage />} />
        <Route path="/admin/board/read/:bno" element={<AdminBoardReadPage />} />
        <Route path="/admin/board/modify/:bno" element={<AdminBoardModifyPage />} />
        
        {/* 어드민-게시판>고객문의 - 신시온 담당*/}
        <Route path="/admin/inquiry" element={<AdminInquiryPage />} />



      </Routes>
    </BrowserRouter>
  );
}

export default App