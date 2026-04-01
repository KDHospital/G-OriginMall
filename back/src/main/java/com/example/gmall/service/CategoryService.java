package com.example.gmall.service;

import com.example.gmall.dto.category.CategoryResponseDTO;

import java.util.List;

public interface CategoryService {

    // 전체 카테고리 목록
    List<CategoryResponseDTO> getCategories();

    // 하위 카테고리 목록
    List<CategoryResponseDTO> getChildren(Integer parentId);
    
    //프론트 카테고리 목록
    List<CategoryResponseDTO> getAllCategories();
}