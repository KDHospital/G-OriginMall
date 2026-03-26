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
import lombok.extern.log4j.Log4j2;

@Log4j2
public class JWTCheckFilter extends OncePerRequestFilter {
	
	protected void doFilterInternal(HttpServletRequest request , HttpServletResponse response ,
			FilterChain filterChain) throws ServletException , IOException{
		
		String authHeader = request.getHeader("Authorization");
		
		if(authHeader == null || !authHeader.startsWith("Bearer ")) {
		filterChain.doFilter(request, response);
		return;
		}
		
		try {
			String accessToken = authHeader.substring(7);
			
			JWTUtil jwtUtil = new JWTUtil();
			Map<String, Object> claims = jwtUtil.validateToken(accessToken);
			
			String loginId = (String) claims.get("loginId");
			
			UsernamePasswordAuthenticationToken authenticationToken =
					new UsernamePasswordAuthenticationToken(loginId, null,List.of());
			
			SecurityContextHolder.getContext().setAuthentication(authenticationToken);
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json");
            response.getWriter().println("{\"error\": \"INVALID_TOKEN\"}");
			return;
		}
		filterChain.doFilter(request, response);
	}

}
