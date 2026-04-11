package com.example.gmall.dto.member;

import org.springframework.boot.security.autoconfigure.SecurityProperties.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberAuthDTO extends User{

	private Long memberId;
    private String loginId;
    private String mname;
    private Byte role;
    private boolean businessVerified;
    private String accessToken;
    private String refreshToken;
    private boolean needsExtraInfo;
    private String socialType;

    
    
}
