package com.example.gmall.dto.member;

import java.util.List;

import lombok.Data;

@Data
public class BusinessStatusResponse {
	private Integer request_cnt;
    private Integer match_cnt;
    private String status_code;
    private List<BusinessData> data; 

    @Data
    public static class BusinessData { 
        private String b_no;       
        private String b_stt;      
        private String b_stt_cd;   
        private String tax_type;   
    }

}
