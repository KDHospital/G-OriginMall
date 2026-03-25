package com.example.gmall.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	@Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. CSRF 보호 비활성화 (테스트 단계에서는 이걸 꺼야 POST 요청이 먹힙니다!)
            .csrf(csrf -> csrf.disable()) 
            
            // 2. 모든 경로에 대해 인증 없이 접근 허용
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() 
            )
            
            // 3. 기본 로그인 폼 비활성화
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
