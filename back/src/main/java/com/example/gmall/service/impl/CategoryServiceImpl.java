package com.example.gmall.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.gmall.domain.Category;
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
    
    // 전체 카테고리 트리 반환 (프론트 네비게이션용)
    // GET /api/categories
    @Override
    public List<CategoryResponseDTO> getAllCategories() {
        List<Category> all = categoryRepository.findAllOrdered();

        return all.stream()
                .filter(c -> c.getParent() == null)
                .map(parent -> {
                    List<CategoryResponseDTO> children = all.stream()
                            .filter(c -> c.getParent() != null &&
                                         parent.getCategoryId().equals(c.getParent().getCategoryId()))
                            .map(CategoryResponseDTO::new)
                            .collect(Collectors.toList());
                    return new CategoryResponseDTO(parent, children);
                })
                .collect(Collectors.toList());
    }
    
}
