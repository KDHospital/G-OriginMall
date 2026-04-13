package com.example.gmall.service;

import com.example.gmall.dto.member.MemberAuthDTO;

public interface NaverService {

	MemberAuthDTO processNaverLogin(String code, String state);
}
