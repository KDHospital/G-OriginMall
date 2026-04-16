package com.example.gmall.service.impl;

import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.apache.naming.factory.SendMailFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
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
	
	public void sendCode(String email , String tyep) {
		// 6자리 난수 생성
		String code = String.format("%06d", new Random().nextInt(1000000));
		
		//Redis에 저장 (key: 이메일 , value: 인증코드, TTL: 3분)
		redisTemplate.opsForValue().set("EMAIL_CODE:"+email,
				code,
				VERIFICATION_CODE_TTL,
				TimeUnit.SECONDS);
		sendEmail(email,code,tyep);
		log.info("인증 코드 발송 완료(타입:{}): {} -> {}",tyep,email, code);
	}
	
	public boolean verifyCode(String email, String code) {
		
		String savedCode = redisTemplate.opsForValue().get("EMAIL_CODE:"+email);
		
		log.info("[검증요청] 이메일: {}, 입력코드: {}, 저장코드: {}", email, code, savedCode);
		
		if(savedCode == null) {
			log.warn("인증 코드 만료 또는 존재하지 않음:{}",email);
			return Boolean.TRUE.equals(redisTemplate.hasKey("EMAIL_VERIFIED:" + email));
		}
		
		if(savedCode.trim().equals(code.trim())) {
			//인증 성공시 Redis에서 코드 삭제(재사용 방지)
			redisTemplate.delete("EMAIL_CODE:"+email);
			redisTemplate.opsForValue().set("EMAIL_VERIFIED:" + email, "TRUE", 5, TimeUnit.MINUTES);
			log.info("인증 성공: {}", email);
			return true;
		}
		
		log.warn("인증 코드 불일치 {}: (입력: {}, 실제: {})",email, code, savedCode);
		return false;
	}
	
	private void sendEmail(String to, String code, String tyep) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(to);
		if("PWD".equals(tyep)) {
		message.setSubject("[G-OriginMall] 비밀번호 찾기 인증 번호입니다.");
		message.setText("안녕하세요. G-OriginMall입니다.\n\n"+
			"비밀번호 재설정을 위한 인증 번호: ["+code+"]\n\n"+
					"3분 이내에 입력해 주세요");	
		}else {
		message.setSubject("[G-OriginMall] 회원가입 인증 번호입니다.");
		message.setText("안녕하세요. G-OriginMall입니다.\n\n"+
		"회원가입 인증 번호: ["+code+"]\n\n"+
				"3분 이내에 입력해 주세요");
		}
	 try {
		mailSender.send(message);
	} catch (Exception e) {
		log.error("메일 발송 실패: {}",e.getMessage());
		throw new RuntimeException("메일 발송 중 오류가 발생했습니다.");
	}
	}
	
	@Override
	@Async
	public void sendSellerStatusNotice(String email, String mname, boolean isApprovde) {
		
		String subject = isApprovde
				?"[G-OriginMall] 판매자 입점 신청이 승인되었습니다."
				:"[G-OriginMall] 판매자 입점 신청 거절 안내";
		String content = isApprovde
				? "안녕하세요,"+ mname + "님! 귀하의 입점 신청이 정상적으로 승인되었습니다. 지금부터 상품 등록이 가능합니다."
				: "안녕하세요,"+ mname + "님. 안타깝게도 귀하의 입점 신청이 거절되었습니다. 자세한 사유는 고객센터로 문의 바랍니다.";
		sendMail(email, subject, content);
	}
	private void sendMail(String to, String subject, String content) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(to);
		message.setSubject(subject);
		message.setText(content);
		
		mailSender.send(message);
		log.info("메일 발송 완료: {}",to);
	}
			

}
