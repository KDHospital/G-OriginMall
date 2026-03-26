import axiosInstance from "./axios"
// 상품 목록 조회
  // params 예시: { page: 0, size: 12, categoryId: 1 }
// categoryId 없으면 전체 조회, 있으면 해당 카테고리만
export const getProducts = (params) => {
  return axiosInstance.get('/api/products', { params });
};