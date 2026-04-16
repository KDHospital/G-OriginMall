package com.example.gmall.dto.banner;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BannerSortOrderDTO {
    // 드래그 앤 드롭으로 순서 변경 시 배너 ID 목록 (순서대로)
    private List<Integer> bannerIds;
}
