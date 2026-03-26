package com.example.gmall.filter;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
	protected void doFilterInternal(HttpServletRequest request , HttpServletResponse response ,
			FilterChain filterChain) throws ServletException , IOException{
		
		String authHeader = request.getHeader("Authorization");
		
		if(authHeader == null || !authHeader.startsWith("Bearer ")) {
		filterChain.doFilter(request, response);
		return;
		}
		
		try {
			String accessToken = authHeader.substring(7);
			
			
			Map<String, Object> claims = jwtUtil.validateToken(accessToken);
			
			String loginId = (String) claims.get("loginId");
			log.info("인증 성공 아이디:{}",loginId);
			
			
			UsernamePasswordAuthenticationToken authenticationToken =
					new UsernamePasswordAuthenticationToken(loginId, null,List.of());
			
			SecurityContextHolder.getContext().setAuthentication(authenticationToken);
		} catch (Exception e) {
			log.info("토큰 검증 에러:{}",e.getMessage());
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json");
            response.getWriter().println("{\"error\": \"INVALID_TOKEN\"}");
			return;
		}
		filterChain.doFilter(request, response);
	}

}
