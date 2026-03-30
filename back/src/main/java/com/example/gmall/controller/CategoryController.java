package com.example.gmall.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.gmall.dto.category.CategoryResponseDTO;
import com.example.gmall.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // 전체 카테고리 목록 조회 (상품 등록 폼용)
    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getCategories() {
        return ResponseEntity.ok(categoryService.getCategories());
    }

    // 하위 카테고리 조회 (상위 카테고리 선택 시)
    @GetMapping("/{parentId}/children")
    public ResponseEntity<List<CategoryResponseDTO>> getChildren(
            @PathVariable Integer parentId) {
        return ResponseEntity.ok(categoryService.getChildren(parentId));
    }
}
