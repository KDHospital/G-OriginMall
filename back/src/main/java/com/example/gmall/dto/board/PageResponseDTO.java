package com.example.gmall.dto.board;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
public class PageResponseDTO<E> {

    private List<E> dtoList; // 게시글 목록
    private long totalCount; // 전체 게시글 수 (프론트의 totalElements 역할)

    @Builder(builderMethodName = "withAll")
    public PageResponseDTO(List<E> dtoList, long totalCount) {
        this.dtoList = dtoList;
        this.totalCount = totalCount;
    }
}