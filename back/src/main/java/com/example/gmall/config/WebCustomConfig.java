package com.example.gmall.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.extern.log4j.Log4j2;


@Configuration
@Log4j2
public class WebCustomConfig implements WebMvcConfigurer {
	
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
}
