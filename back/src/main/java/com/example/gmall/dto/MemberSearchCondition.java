package com.example.gmall.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberSearchCondition {

	//이름 또는 아이디 검색
	private String searchKeyword;
	
	//이메일 검색
	private String email; 
	
	//역할(역할 전체, ADMIN, SELLER, USER)
	private Byte role;
	
	//상태(상테 전체, 정상, 탈퇴, 승인대기 등)
	private String status;
	
	//가입일 기간 검색
	private LocalDate startDate; 
	private LocalDate endDate;
	
}
