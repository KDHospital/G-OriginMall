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
import CertifiedListPage from './pages/products/CertifiedListPage';
import CertifiedDetailPage from './pages/products/CertifiedDetailPage';
import ExhibitionListPage from './pages/products/ExhibitionListPage';
import ExhibitionDetailPage from './pages/products/ExhibitionDetailPage';

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
import SellerSingupPage from './pages/member/SellerSignupPage';
import SellerProductListPage from './pages/seller/SellerProductListPage';
import SellerOrders from './pages/seller/SellerOrders';
import SellerOrderDetail from './pages/seller/SellerOrderDetail';

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

import ProtectedRoute from './components/support/ProtectedRoute';

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
        <Route path='/mypage' element={<ProtectedRoute><Mypapge /></ProtectedRoute>} />
        <Route path='/modifypage' element={<ProtectedRoute><ModifyPage /></ProtectedRoute>} />
        <Route path='/findid' element={<FindIdPage />} />
        <Route path='/findpwd' element={<FindPwdPage />} />
        {/* 회원(판매자) - 유재영 담당 */}
        {/* <Route path="/sellerjoin" element={<SellerJoinPage />} /> */}
        <Route path='/sellersignup' element={<SellerSingupPage />} />
        {/* 장바구니 - 김슬기 담당 */}
        <Route path="/cart" element={<ProtectedRoute allowRole={0}><CartPage /></ProtectedRoute>} />

        {/* 상품 - 이효진 담당 */}
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/products/certified" element={<CertifiedListPage />} />
        <Route path="/products/certified/:productId" element={<CertifiedDetailPage />} />
        <Route path="/products/exhibition" element={<ExhibitionListPage />} />
        <Route path="/products/exhibition/:productId" element={<ExhibitionDetailPage />} />
        

        {/* 주문 - 김슬기 담당 */}
        <Route path="/orders/new" element={<ProtectedRoute allowRole={0}><OrderFormPage /></ProtectedRoute>} />
        <Route path="/orders/success" element={<ProtectedRoute allowRole={0}><OrderSuccessPage /></ProtectedRoute>} />
        <Route path="/orders/fail"    element={<ProtectedRoute allowRole={0}><OrderFailPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute allowRole={0}><MyOrders /></ProtectedRoute>} /> 
        <Route path="/orders/:orderId" element={<ProtectedRoute allowRole={0}><MyOrderDetail /></ProtectedRoute>} />

        {/* 게시판>공지사항 - 신시온 담당*/}
        <Route path="/board" element={<BoardPage />} />
        <Route path="/board/read/:bno" element={<BoardReadPage />} />
        <Route path="/inquiry" element={<InquiryPage />} />
        <Route path="/inquiry/add" element={<InquiryAddModal />} />
        <Route path="/faq" element={<FaqPage />} />




        {/* 어드민 */}
        <Route path="/admin" element={<ProtectedRoute allowRole={2}><AdminDashboardPage /></ProtectedRoute>} />

        {/* 판매자 */}
        <Route path="/seller" element={<ProtectedRoute allowRole={1}><SellerDashboardPage /></ProtectedRoute>} />
        <Route path="/seller/products/new" element={<ProtectedRoute allowRole={1}><SellerProductNewPage /></ProtectedRoute>} />
        <Route path="/seller/products" element={<ProtectedRoute allowRole={1}><SellerProductListPage /></ProtectedRoute>} />
        <Route path="/seller/orders" element={<ProtectedRoute allowRole={1}><SellerOrders /></ProtectedRoute>} />
        <Route path="/seller/orders/:orderId" element={<ProtectedRoute allowRole={1}><SellerOrderDetail /></ProtectedRoute>} />


        {/* 어드민-상품등록 */}
        <Route path="/admin/products/new" element={<ProtectedRoute allowRole={2}><AdminProductNewPage /></ProtectedRoute>} />



        {/* 어드민-게시판>공지사항 - 신시온 담당*/}
        <Route path="/admin/board" element={<ProtectedRoute allowRole={2}><AdminBoardListPage /></ProtectedRoute>} />
        <Route path="/admin/board/new" element={<ProtectedRoute allowRole={2}><AdminBoardAddPage /></ProtectedRoute>} />
        <Route path="/admin/board/read/:bno" element={<ProtectedRoute allowRole={2}><AdminBoardReadPage /></ProtectedRoute>} />
        <Route path="/admin/board/modify/:bno" element={<ProtectedRoute allowRole={2}><AdminBoardModifyPage /></ProtectedRoute>} />
        
        {/* 어드민-게시판>고객문의 - 신시온 담당*/}
        <Route path="/admin/inquiry" element={<ProtectedRoute allowRole={2}><AdminInquiryPage /></ProtectedRoute>} />



      </Routes>
    </BrowserRouter>
  );
}

export default App