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

export const putProductsmodify = (productId) => {
  return axiosInstance.put(`/seller/products/${productId}`);
}