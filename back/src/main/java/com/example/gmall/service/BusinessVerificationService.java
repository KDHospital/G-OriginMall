package com.example.gmall.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BusinessVerificationService {
	@Value("${api.serviceKey}") 
    private String serviceKey;

    public boolean isRealBusiness(String businessNo) {
        
        String cleanNo = businessNo.replaceAll("-", "");
        String url = "https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=" + serviceKey;

        RestTemplate restTemplate = new RestTemplate();
        
        
        Map<String, Object> body = new HashMap<>();
        body.put("b_no", Collections.singletonList(cleanNo));

        try {
            
            Map<String, Object> response = restTemplate.postForObject(url, body, Map.class);
            log.info("국세청 전체 응답: {}", response);
            List<Map<String, Object>> data = (List<Map<String, Object>>) response.get("data");

            if (data != null && !data.isEmpty()) {
                String status = (String) data.get(0).get("b_stt_cd"); // 01: 계속사업자
                return "01".equals(status);
            }
        } catch (Exception e) {
            log.error("사업자 인증 API 통신 실패: {}", e.getMessage());
        }
        return false;
    }
}
