package com.example.gmall.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.gmall.domain.Banner;
@Repository
public interface BannerRepository extends JpaRepository<Banner, Integer> {
	//웹 메인 용 - 활성화된 배너만, 정렬순으로 출력
	List<Banner> findByIsActiveTrueOrderBySortOrderAsc();

    // 어드민용 - 전체 배너, 정렬순으로
    List<Banner> findAllByOrderBySortOrderAsc();
    long countByIsActiveTrue();
}
