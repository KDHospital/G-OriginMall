package com.example.gmall.dto.member;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberDTO {
	private Long id;
	private String loginId;
	private String mpwd;
	private String currentMpwd;
	private String mname;
	private String tel;
	private Byte gender;
	private Byte role;
	private Boolean social;
	private Boolean needsExtraInfo;
	private LocalDateTime created_at;

}
