package com.example.gmall.service;

import com.example.gmall.dto.member.MemberAuthDTO;

public interface KakaoService {
	   
	MemberAuthDTO processKakaoLogin(String code);
	    
    
}

