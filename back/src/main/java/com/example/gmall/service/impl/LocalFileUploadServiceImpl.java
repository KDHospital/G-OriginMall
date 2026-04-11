package com.example.gmall.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.gmall.repository.BannerRepository;
import com.example.gmall.service.LocalFileUploadService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) 
public class LocalFileUploadServiceImpl implements LocalFileUploadService {

    private static final String UPLOAD_ROOT = System.getProperty("user.dir") + "/uploads/";
    private static final String BANNER_DIR = UPLOAD_ROOT + "banners/";

    /**
     * 배너 이미지를 로컬 디렉토리에 저장하고
     * 프론트에서 접근 가능한 정적 URL 경로를 반환합니다.
     *
     * 저장 위치 : {user.dir}/uploads/banners/{uuid}.{ext}
     * 반환 URL  : /uploads/banners/{uuid}.{ext}
     */
    public String uploadBannerImage(MultipartFile file) {
    	
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("파일이 없습니다.");
        }
        
        validateImageFile(file);

        String ext       = getExtension(file.getOriginalFilename());
        String filename  = UUID.randomUUID() + "." + ext;

        try {
        	// ── 디렉토리 생성 ─────────────────────────────
            Path dirPath = Paths.get(BANNER_DIR);
            Files.createDirectories(dirPath);                   // 디렉토리 없으면 생성

            // ── 파일 저장 ─────────────────────────────
            Path dest = dirPath.resolve(filename);
            Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

            log.info("=== 배너 업로드 디버깅 ===");
            log.info("저장 경로: {}", dest.toAbsolutePath());
            log.info("파일 존재 여부: {}", Files.exists(dest));

        } catch (IOException e) {
            throw new RuntimeException("이미지 저장에 실패했습니다.", e);
        }

        // 정적 리소스 URL (WebConfig 에서 /uploads/** 매핑 필요)
        // ── 프론트에서 접근할 URL ───────────────────────
        return "/uploads/banners/" + filename;
    }

    // ── 이미지 검증 ─────────────────────────────
    // ── 내부 유틸 ──────────────────────────────────────────────────────────
    private void validateImageFile(MultipartFile file) {
    	String ext = getExtension(file.getOriginalFilename()).toLowerCase();
        if (!ext.equals("jpg") && !ext.equals("jpeg") && !ext.equals("png")) {
            throw new IllegalArgumentException("JPG 또는 PNG 파일만 업로드 가능합니다.");
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1);
    }
    
}
