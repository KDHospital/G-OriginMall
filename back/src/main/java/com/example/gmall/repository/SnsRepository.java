package com.example.gmall.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gmall.domain.Sns;

public interface SnsRepository extends JpaRepository<Sns, Long>{

	Optional<Sns> findByProviderAndProviderUserId(String provider,String providerUserId );
}
