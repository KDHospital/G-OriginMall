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
import MyAddresses from './pages/member/MyAddresses';

import ModifyPage from './pages/member/ModifyPage';
import Mypapge from './pages/member/MyPage';
import FindIdPage from './pages/member/FindIdPage';
import FindPwdPage from './pages/member/FindPwdPage';
import KakaoRedirectHandler from './handler/KakaoRedirectHandler';
import NaverRedirectHandler from './handler/NaverRedirectHandler';

import SellerDashboardPage from './pages/seller/SellerDashboardPage';
import SellerProductNewPage from './pages/seller/SellerProductNewPage';
import SellerSingupPage from './pages/member/SellerSignupPage';
import SellerProductListPage from './pages/seller/SellerProductListPage';
import SellerOrders from './pages/seller/SellerOrders';
import SellerOrderDetail from './pages/seller/SellerOrderDetail';
import SellerProductModifyPage from './pages/seller/SellerProductModifyPage';

import AdminMemberListPage from './pages/admin/AdminMemberListPage';
import AdminMemberDetailPage from './pages/admin/AdminMemberDetailPage';
import AdminMemberAddPage from './pages/admin/AdminMemberAddPage';
import AdminMemberModifyPage from './pages/admin/AdminMemberModifyPage';
import AdminSellerListPage from './pages/admin/AdminSellerListPage';
import AdminSellerAddPage from './pages/admin/AdminSellerAddPage';
import AdminSellerDetailPage from './pages/admin/AdminSellerDetailPage';
import AdminSettingListPage from './pages/admin/AdminSettingListPage';
import AdminSettingAddPage from './pages/admin/AdminSettingAddPage';
import AdminSettingDetailPage from './pages/admin/AdminSettingDetailPage';
import AdminBoardListPage from './pages/admin/AdminBoardListPage';
import AdminBoardAddPage from './pages/admin/AdminBoardAddPage';
import AdminBoardReadPage from './pages/admin/AdminBoardReadPage';
import AdminBoardModifyPage from './pages/admin/AdminBoardModifyPage';
import AdminInquiryPage from './pages/admin/AdminInquiryPage';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminProductListPage from './pages/admin/AdminProductListPage';
import AdminProductModifyPage from './pages/admin/AdminProductModifyPage';

import BoardPage from './pages/support/BoardPage';
import BoardReadPage from './pages/support/BoardReadPage';
import InquiryPage from './pages/support/InquiryPage';
import InquiryAddModal from './pages/support/InquiryAddModal';
import FaqPage from './pages/support/FaqPage';

import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';


// 팀원들이 페이지 컴포넌트 만들면 여기에 import 추가
// 예시:
// import JoinPage from './pages/member/JoinPage';
// import SellerPage from './pages/member/SellerPage';
// import ProductListPage from './pages/product/ProductListPage';
// import OrderPage from './pages/order/OrderPage';



function App() {
  
  return (
    <BrowserRouter>
      <CartProvider>
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
          <Route path='/addresses' element={<ProtectedRoute allowRole={0}><MyAddresses/></ProtectedRoute>} />
          <Route path='/oauth/kakao' element={<KakaoRedirectHandler />} />
          <Route path='/oauth/naver' element={<NaverRedirectHandler />} />

          {/* 회원(판매자) - 유재영 담당 */}
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

          {/* 게시판 - 신시온 담당*/}
          <Route path="/board" element={<BoardPage />} />
          <Route path="/board/read/:postId" element={<BoardReadPage />} />
          <Route path="/inquiry" element={<InquiryPage />} />
          <Route path="/inquiry/add" element={<InquiryAddModal />} />
          <Route path="/faq" element={<FaqPage />} />




          {/* 어드민 */}
          <Route path="/admin" element={<ProtectedRoute allowRole={2}><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute allowRole={2}><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/orders/:orderId" element={<ProtectedRoute allowRole={2}><AdminOrderDetail /></ProtectedRoute>} />

          {/* 어드민-회원관리>일반회원 - 신시온 담당*/}
          <Route path="/admin/members" element={<ProtectedRoute allowRole={2}><AdminMemberListPage /></ProtectedRoute>} />
          <Route path="/admin/members/new" element={<ProtectedRoute allowRole={2}><AdminMemberAddPage /></ProtectedRoute>} />
          <Route path="/admin/members/:memberId" element={<ProtectedRoute allowRole={2}><AdminMemberDetailPage /></ProtectedRoute>} />
          <Route path="/admin/members/:memberId/modify" element={<ProtectedRoute allowRole={2}><AdminMemberModifyPage /></ProtectedRoute>} />

          {/* 어드민-회원관리>판매회원 - 신시온 담당*/}
          <Route path="/admin/sellers" element={<ProtectedRoute allowRole={2}><AdminSellerListPage /></ProtectedRoute>} />
          <Route path="/admin/sellers/new" element={<ProtectedRoute allowRole={2}><AdminSellerAddPage /></ProtectedRoute>} />
          <Route path="/admin/sellers/:memberId" element={<ProtectedRoute allowRole={2}><AdminSellerDetailPage /></ProtectedRoute>} />

          {/* 어드민-회원관리>관리자 - 신시온 담당*/}
          <Route path="/admin/admins" element={<ProtectedRoute allowRole={2}><AdminSettingListPage /></ProtectedRoute>} />
          <Route path="/admin/admins/new" element={<ProtectedRoute allowRole={2}><AdminSettingAddPage /></ProtectedRoute>} />
          <Route path="/admin/admins/:memberId" element={<ProtectedRoute allowRole={2}><AdminSettingDetailPage /></ProtectedRoute>} />

          {/* 어드민-게시판>공지사항 - 신시온 담당*/}
          <Route path="/admin/board" element={<ProtectedRoute allowRole={2}><AdminBoardListPage /></ProtectedRoute>} />
          <Route path="/admin/board/new" element={<ProtectedRoute allowRole={2}><AdminBoardAddPage /></ProtectedRoute>} />
          <Route path="/admin/board/read/:postId" element={<ProtectedRoute allowRole={2}><AdminBoardReadPage /></ProtectedRoute>} />
          <Route path="/admin/board/modify/:postId" element={<ProtectedRoute allowRole={2}><AdminBoardModifyPage /></ProtectedRoute>} />

          {/* 어드민-게시판>고객문의 - 신시온 담당*/}
          <Route path="/admin/inquiry" element={<ProtectedRoute allowRole={2}><AdminInquiryPage /></ProtectedRoute>} />
          <Route path="/admin/inquiry/new" element={<ProtectedRoute allowRole={2}><AdminBoardAddPage /></ProtectedRoute>} />
          <Route path="/admin/inquiry/read/:postId" element={<ProtectedRoute allowRole={2}><AdminBoardReadPage /></ProtectedRoute>} />
          <Route path="/admin/inquiry/modify/:postId" element={<ProtectedRoute allowRole={2}><AdminBoardModifyPage /></ProtectedRoute>} />

          {/* 판매자 */}
          <Route path="/seller" element={<ProtectedRoute allowRole={1}><SellerDashboardPage /></ProtectedRoute>} />
          <Route path="/seller/products/new" element={<ProtectedRoute allowRole={1}><SellerProductNewPage /></ProtectedRoute>} />
          <Route path="/seller/products" element={<ProtectedRoute allowRole={1}><SellerProductListPage /></ProtectedRoute>} />
          <Route path="/seller/orders" element={<ProtectedRoute allowRole={1}><SellerOrders /></ProtectedRoute>} />
          <Route path="/seller/orders/:orderId" element={<ProtectedRoute allowRole={1}><SellerOrderDetail /></ProtectedRoute>} />
          <Route path="/seller/products/:productId/edit" element={<ProtectedRoute allowRole={1}><SellerProductModifyPage /></ProtectedRoute>} />

        {/* 어드민-상품관리,목록 */}
        <Route path="/admin/products/new" element={<ProtectedRoute allowRole={2}><AdminProductNewPage /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute allowRole={2}><AdminProductListPage /></ProtectedRoute>} />
        <Route path="/admin/products/:productId/edit" element={<ProtectedRoute allowRole={2}><AdminProductModifyPage /></ProtectedRoute>} />






        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App