package com.example.gmall.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.gmall.domain.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    // 최상위 카테고리 목록 (parent가 null인 것)
    List<Category> findByParentIsNull();

    // 특정 상위 카테고리의 하위 카테고리 목록
    List<Category> findByParentCategoryId(Integer parentId);
    
    // 전체 트리 (프론트 카테고리 네비게이션용)
    @Query("SELECT c FROM Category c ORDER BY c.parent ASC NULLS FIRST, c.sortOrder ASC")
    List<Category> findAllOrdered();
}
