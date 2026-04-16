package com.example.gmall.controller;

import com.example.gmall.dto.manage.SellerDashboardResponseDTO;
import com.example.gmall.service.SellerDashboardService;

import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor

public class SellerDashboardController {

    private final SellerDashboardService sellerDashboardService;

    @GetMapping("/seller/dashboard")
    public ResponseEntity<SellerDashboardResponseDTO> getDashboard(
            Authentication authentication
    ) {
        Long sellerId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(sellerDashboardService.getDashboard(sellerId));
    }
}