package com.example.gmall.service;

import com.example.gmall.dto.manage.SellerDashboardResponseDTO;

public interface SellerDashboardService {
    SellerDashboardResponseDTO getDashboard(Long sellerId);
}