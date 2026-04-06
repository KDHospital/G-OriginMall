package com.example.gmall.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

import com.example.gmall.filter.JWTCheckFilter;
import com.example.gmall.util.JWTUtil;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	
	private final JWTUtil jwtUtil;
	
	@Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. CSRF 보호 비활성화 
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http))
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
            
            .addFilterBefore(new JWTCheckFilter(jwtUtil), 
            		org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
            // 2. 모든 경로에 대해 인증 없이 접근 허용
            .authorizeHttpRequests(auth -> auth
            		// 관리자 전용
            		.requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
            		// 인증 필요
            		.requestMatchers("/api/member/me", "/api/members/addresses/**", "/api/orders/**").authenticated()
            		.requestMatchers(org.springframework.http.HttpMethod.POST, "/api/board/inquiry").authenticated()
            		.requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/board/inquiry/**").authenticated()
            		.requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/board/**").authenticated()
            		// 나머지 허용
            		.anyRequest().permitAll()
            )
            
            // 3. 기본 로그인 폼 비활성화
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }

}
