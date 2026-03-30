package com.example.gmall.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.gmall.dto.category.CategoryResponseDTO;
import com.example.gmall.repository.CategoryRepository;
import com.example.gmall.service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {
	
	private final CategoryRepository categoryRepository;

    // 전체 카테고리 목록
    @Override
    public List<CategoryResponseDTO> getCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryResponseDTO::new)
                .collect(Collectors.toList());
    }

    // 하위 카테고리 목록
    @Override
    public List<CategoryResponseDTO> getChildren(Integer parentId) {
        return categoryRepository.findByParentCategoryId(parentId)
                .stream()
                .map(CategoryResponseDTO::new)
                .collect(Collectors.toList());
    }
	
}
