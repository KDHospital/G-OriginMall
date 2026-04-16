import axiosInstance from "./axios"
//웹-상품 목록 조회
// params 예시: { page: 0, size: 12, categoryId: 1 }
// categoryId 없으면 전체 조회, 있으면 해당 카테고리만
export const getProducts = (params) => {
  return axiosInstance.get('/products', {params});
};

//웹-상품 상세 조회
export const getProductDetail = (productId) => {
  return axiosInstance.get(`/products/${productId}`);
};
//웹-카테고리
export const getCategories = () => {
    return axiosInstance.get('/categories/menu');
};
//웹-금빛나루 전용관 상품 목록 조회
// params 예시: { page: 0, size: 12, categoryId: 1 }
// categoryId 없으면 전체 조회, 있으면 해당 카테고리만
export const getCertifiedProducts = (params) => {
  return axiosInstance.get('/products/certified',{params});
}
//웹-기획전 전용관 상품 목록 조회
// params 예시: { page: 0, size: 12, categoryId: 1 }
// categoryId 없으면 전체 조회, 있으면 해당 카테고리만
export const getExhibitionProducts = (params) => {
  return axiosInstance.get('/products/exhibition',{params});
}
//셀러-상품 수정
export const putProductsmodify = (productId) => {
  return axiosInstance.put(`/seller/products/${productId}`);
}

// 1. 어드민 상품 목록 조회
export const getAdminProducts = (params) => {
  // params: { page: 0, size: 10 }
  return axiosInstance.get('/admin/products', { params });
};

// 2. 어드민 상품 검색
export const searchAdminProducts = (params) => {
  /* params: { 
       keyword: '두부', categoryId: 11, sellerName: '김포농부', 
       soldStatus: 0, page: 0, size: 10 
     } 
  */
  return axiosInstance.get('/admin/products/search', { params });
};

// 3. 어드민 선택 숨김처리 (PATCH)
export const hideProducts = (productIds) => {
  // productIds: [17, 18, 20] (Long 타입 배열)
  return axiosInstance.patch('/admin/products/hide', productIds);
};

// 4. 어드민 선택 삭제 (DELETE)
export const deleteProducts = (productIds) => {
  // 주의: delete는 { data: ... } 형식으로 넘겨야 바디에 들어감
  return axiosInstance.delete('/admin/products', { data: productIds });
};

//어드민-상품 수정
export const putProductsAdminModify = (productId) => {
  return axiosInstance.put(`/admin/products/${productId}`);
}