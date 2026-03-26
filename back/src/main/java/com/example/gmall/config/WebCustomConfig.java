package com.example.gmall.config;

import java.io.File;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.annotation.PostConstruct;
import lombok.extern.log4j.Log4j2;


@Configuration
@Log4j2
public class WebCustomConfig implements WebMvcConfigurer {
	
	// 업로드 파일 저장 루트 경로
    // ── 운영 환경 배포 시 외부 경로로 변경 필요 ──────────────────────
    // 예) /var/www/gmall/uploads
    // ────────────────────────────────────────────────────────────────
    private static final String UPLOAD_ROOT = System.getProperty("user.dir") + "/uploads/";
    
    // ── 서버 시작 시 업로드 폴더 자동 생성 ──────────────────────────
    @PostConstruct
    public void createUploadDirectories() {
        String productsPath = UPLOAD_ROOT + "products/";
        String bannersPath = UPLOAD_ROOT + "banners/";
        
        log.info("upload path: {}", productsPath); // 실제 경로 확인용
        
        File productsDir = new File(productsPath);
        File bannersDir = new File(bannersPath);
        
        if (!productsDir.exists()) productsDir.mkdirs();
        if (!bannersDir.exists()) bannersDir.mkdirs();
        
        log.info("products exists: {}", productsDir.exists());
        log.info("banners exists: {}", bannersDir.exists());
        log.info("---------- upload directories created ---------");
    }
	
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		log.info("---------- cors start ---------");
		
		registry.addMapping("/api/**")
				.allowedOrigins("http://localhost:5173")
				.allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
				.allowedHeaders("*")
				.allowCredentials(true)
				.maxAge(3600);
		
		log.info("---------- cors end ---------");
		// = registry 설명 =
		// Back으로 가는 경로 설정 : front -> back 진입 시 /api/** url 구조로 접속.
		// Front에서 받아올 때 허용하는 경로 설정 : vite 방식 -> 5173 포트 사용중.
		// 허용하는 메소드 설정 : Methods에 OPTIONS가 없는 이유는 Spring이 내포하고 있음.
		// 허용하는 헤더 설정 : 모든 헤더 정보 허용
		// 허용하는 증명 정보 설정 : 자격 증명에 대한 정보 허용 (로그인 관련 토큰/쿠키 허용)
		// 브라우저가 위 설정을 기억하는 시간 설정 : 3600 초
	}
	
	
	
	@Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        log.info("---------- resource handler start ---------");

        // 상품 이미지
        // URL: http://localhost:8080/uploads/products/{productId}/xxx.jpg
        registry.addResourceHandler("/uploads/products/**")
                .addResourceLocations("file:" + UPLOAD_ROOT + "products/");

        // 배너/기획전 이미지
        // URL: http://localhost:8080/uploads/banners/{bannerId}/xxx.jpg
        registry.addResourceHandler("/uploads/banners/**")
                .addResourceLocations("file:" + UPLOAD_ROOT + "banners/");

        log.info("---------- resource handler end ---------");
    }
	
	
}
