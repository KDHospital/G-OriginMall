package com.example.gmall.util;

import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.InvalidClaimException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JWTUtil {

	private static String key = "your-very-secret-key-gmall-project-2026-fighting";

	// 1. 토큰 생성 (로그인 시 사용)
    public String generateToken(Map<String, Object> valueMap, int min) {
        SecretKey secretKey = Keys.hmacShaKeyFor(JWTUtil.key.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .setHeader(Map.of("typ", "JWT"))
                .setClaims(valueMap)
                .setIssuedAt(Date.from(ZonedDateTime.now().toInstant()))
                .setExpiration(Date.from(ZonedDateTime.now().plusMinutes(min).toInstant()))
                .signWith(secretKey)
                .compact();
    }

    // 2. 토큰 검증 및 내용 추출 (필터에서 사용)
    public Map<String, Object> validateToken(String token) {
        SecretKey secretKey = Keys.hmacShaKeyFor(JWTUtil.key.getBytes(StandardCharsets.UTF_8));

        try {
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Expired");
        } catch (InvalidClaimException e) {
            throw new RuntimeException("Invalid");
        } catch (JwtException e) {
            throw new RuntimeException("Error");
        }
    }
}
