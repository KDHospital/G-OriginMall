// src/utils/imageUtils.js
const BASE_URL = 'http://localhost:8080';

export const getImageUrl = (url) => {
  if (!url) return '';
  // 이미 http로 시작하면 그대로, 아니면 앞에 BASE_URL 붙임
  if (url.startsWith('http')) return url;
  return BASE_URL + url;
};