package com.example.gmall.service.impl;

import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.gmall.service.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl  implements EmailService{
	
	private final JavaMailSender mailSender;
	private final StringRedisTemplate redisTemplate;
	
	//인증 코드 유효 시간 (3분)
	private static final Long VERIFICATION_CODE_TTL = 180L;
	
	@Override
	public void sendCode(String email) {
		// 6자리 난수 생성
		String code = String.format("%06d", new Random().nextInt(1000000));
		
		//Redis에 저장 (key: 이메일 , value: 인증코드, TTL: 3분)
		redisTemplate.opsForValue().set("EMAIL_CODE:"+email,
				code,
				VERIFICATION_CODE_TTL,
				TimeUnit.SECONDS);
		sendEmail(email,code);
		log.info("인증 코드 발송 완료: {} -> {}",email, code);
	}
	
	@Override
	public boolean verifyCode(String email, String code) {
		
		String savedCode = redisTemplate.opsForValue().get("EMAIL_CODE:"+email);
		
		if(savedCode == null) {
			log.warn("인증 코드 만료 또는 존재하지 않음:{}",email);
			return false;
		}
		
		if(savedCode.equals(code)) {
			//인증 성공시 Redis에서 코드 삭제(재사용 방지)
			redisTemplate.delete("EMAIL_CODE:"+email);
			log.info("인증 성공: {}", email);
			return true;
		}
		
		log.warn("인증 코드 불일치 {}: (입력: {}, 실제: {})",email, code, savedCode);
		return false;
	}
	
	private void sendEmail(String to, String code) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(to);
		message.setSubject("[G-OriginMall] 회원가입 인증 번호입니다.");
		message.setText("안녕하세요. G-OriginMall입니다.\n\n"+
		"인증 번호: ["+code+"]\n\n"+
				"3분 이내에 입력해 주세요");
		
	 try {
		mailSender.send(message);
	} catch (Exception e) {
		log.error("메일 발송 실패: {}",e.getMessage());
		throw new RuntimeException("메일 발송 중 오류가 발생했습니다.");
	}
	}

}
