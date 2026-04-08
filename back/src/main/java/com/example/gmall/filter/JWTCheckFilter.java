package com.example.gmall.filter;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.gmall.util.JWTUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RequiredArgsConstructor
public class JWTCheckFilter extends OncePerRequestFilter {
	
	private final JWTUtil jwtUtil;
	
	@Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        log.info("check filter path: " + path);

        // 1. 카테고리 메뉴, 상품 조회 등 GET 요청은 통과
        if (path.startsWith("/api/categories/") || path.startsWith("/api/products/")) {
            return true;
        }

        // 2. 로그인, 회원가입 관련 경로 통과
        if (path.startsWith("/api/member/login") || path.startsWith("/api/member/join")) {
            return true;
        }
        
        // 3. 테스트용 경로 등
        if (path.startsWith("/api/test")) {
            return true;
        }

        return false; 
    }
	
	@Override
	protected void doFilterInternal(HttpServletRequest request , HttpServletResponse response ,
			FilterChain filterChain) throws ServletException , IOException{
		
		String accessToken = null;
		
		String authHeader = request.getHeader("Authorization");
		if(authHeader != null && authHeader.startsWith("Bearer ")) {
			accessToken = authHeader.substring(7);
			log.info("Header에서 토큰 추출 성공");
		}
		if(accessToken == null) {
		jakarta.servlet.http.Cookie[] cookies = request.getCookies();
	
		if(cookies != null) {
			for (jakarta.servlet.http.Cookie cookie : cookies) {
				if("refreshToken".equals(cookie.getName())) {
					accessToken = cookie.getValue();
					break;
				}
				}
			}
		}
		
		if(accessToken == null) {
			filterChain.doFilter(request, response);
			return;
		}
		try {
			Map<String, Object> claims = jwtUtil.validateToken(accessToken);
			
			Object idObj = claims.get("memberId");
		    if (idObj == null) {
		        throw new RuntimeException("토큰에 사용자 ID가 없습니다. 다시 로그인하세요.");
		    }
		    
			Long memberId = ((Number) claims.get("memberId")).longValue(); 
		    
			Integer role = ((Number) claims.get("role")).intValue();
			
			log.info("쿠키 인증 성공! 회원번호:{}, role: {}",memberId,role);
			
			String authority = switch (role) {
			case 1 -> "ROLE_SELLER";
			case 2 -> "ROLE_ADMIN";
			default -> "ROLE_USER";
			};
			UsernamePasswordAuthenticationToken authenticationToken =
					new UsernamePasswordAuthenticationToken(memberId, null,List.of(new SimpleGrantedAuthority(authority)));
			
			SecurityContextHolder.getContext().setAuthentication(authenticationToken);
		} catch (Exception e) {
			log.info("토큰 검증 에러: {}",e.getMessage());
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json; charset=UTF-8");
			response.getWriter().println("{\"error\": \"INVALID_TOKEN\", \"message\": \"세션이 만료되었습니다.\"}");
			return;
		}
		
		
		filterChain.doFilter(request, response);
}
}
