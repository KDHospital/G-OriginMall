package com.example.gmall.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.querydsl.jpa.impl.JPAQueryFactory;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Configuration
public class QuerydslConfig {
	
	@PersistenceContext
	private EntityManager entityManager;
	
	@Bean
	public JPAQueryFactory jpaQueryFactory() {
		// JPAQueryFactory가 데이터를 쿼리할 때 사용할 EntityManager를 넘겨줍니다.
		return new JPAQueryFactory(entityManager);
	}
	
}
