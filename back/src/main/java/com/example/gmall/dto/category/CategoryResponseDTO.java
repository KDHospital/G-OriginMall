package com.example.gmall.dto.category;

import java.util.List;

import com.example.gmall.domain.Category;
import lombok.Getter;

@Getter
public class CategoryResponseDTO {

    private Integer categoryId;
    private String categoryName;
    private Integer parentId;
    private Integer sortOrder;
    private List<CategoryResponseDTO> children;

    public CategoryResponseDTO(Category category) {
        this.categoryId = category.getCategoryId();
        this.categoryName = category.getCategoryName();
        this.parentId = category.getParent() != null
                ? category.getParent().getCategoryId()
                : null;
        this.sortOrder = category.getSortOrder();
    }
    
    public CategoryResponseDTO(Category c, List<CategoryResponseDTO> children) {
        this(c);
        this.children = children;
    }
}
